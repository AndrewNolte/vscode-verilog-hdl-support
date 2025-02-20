// SPDX-License-Identifier: MIT
import * as vscode from 'vscode'
import { ext } from '../extension'
import { FileDiagnostic, isSystemVerilog } from '../utils'
import BaseLinter from './BaseLinter'
import * as path from 'path'
import { getWorkspaceFolder } from '../utils'

export default class VerilatorLinter extends BaseLinter {
  constructor(name: string) {
    super(name)
  }
  protected convertToSeverity(severityString: string): vscode.DiagnosticSeverity {
    if (severityString.startsWith('Error')) {
      return vscode.DiagnosticSeverity.Error
    } else if (severityString.startsWith('Warning')) {
      return vscode.DiagnosticSeverity.Warning
    }
    return vscode.DiagnosticSeverity.Information
  }

  protected toolArgs(doc: vscode.TextDocument): string[] {
    let args = ['--lint-only']
    if (isSystemVerilog(doc.languageId)) {
      args.push('-sv')
    }
    return args
  }

  protected async makeAdjustments(targetKey: string, diags: FileDiagnostic[]): Promise<boolean> {
    let addedPkgs = false
    let pkgs = this.addArgs.get(targetKey) ?? []

    for (let diag of diags) {
      if (diag.code !== 'PKGNODECL') {
        continue
      }
      const pattern = /'([^']+)'/
      const match = diag.message.match(pattern)
      if (match === null || match?.length < 2) {
        continue
      }
      let pkg = await ext.index.findFile(match[1])
      if (!pkg) {
        this.logger.info("couldn't find package " + pkg)
        continue
      }
      let ind = pkgs.indexOf(pkg.uri.fsPath)
      if (ind !== -1) {
        pkgs.splice(ind, 1)
      }
      pkgs.unshift(pkg.uri.fsPath)
      addedPkgs = true
    }

    this.addArgs.set(targetKey, pkgs)
    return addedPkgs
  }

  protected parseDiagnostics(args: {
    doc: vscode.TextDocument
    stdout: string
    stderr: string
  }): FileDiagnostic[] {
    let diagnostics: FileDiagnostic[] = []
    let lines = args.stderr.split(/\r?\n/g)
    for (let n = 0; n < lines.length; n++) {
      let line: string = lines[n]
      if (!line.startsWith('%')) {
        continue
      }

      // alternate:
      // "%Error(-[A-Z0-9]+)?: ((\\S+):(\\d+):((\\d+):)? )?(.*)$",
      let rex = line.match(/%(\w+)(-\w+)?: (\S+):(\d+):(\d+): (.+)/)

      if (!rex || rex[0].length === 0) {
        continue
      }
      let severity = rex[1]
      let warningType = rex[2] !== undefined ? rex[2].substring(1) : ''
      let file = rex[3]
      let lineNum = Number(rex[4]) - 1
      let colNum = Number(rex[5]) - 1
      let msg = rex[6]

      let pline = lines[n + 2]
      let pindex = pline.indexOf('^')
      let elen = pline.length - pindex
      n += 2
      /// right index

      //Convert to abs paths in case that verilator outputs relative paths
      const workspacePath = getWorkspaceFolder()
      if (workspacePath && !path.isAbsolute(file)) {
          file = path.resolve(workspacePath, file)
      }
      file = path.normalize(file)

      if (!isNaN(lineNum)) {
        diagnostics.push({
          file: file,
          severity: this.convertToSeverity(severity),
          range: new vscode.Range(lineNum, colNum, lineNum, colNum + elen),
          message: msg,
          code: warningType,
          source: 'verilator',
        })
      }
    }
    return diagnostics
  }
}
