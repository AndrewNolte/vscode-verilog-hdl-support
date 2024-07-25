import { ConfigObject, ExtensionComponent } from './lib/libconfig'

export class InlayHintsComponent extends ExtensionComponent {
  /// Inlay hints config
  /// This is just used for containing config, impl is in src/analysis/CtagsServerComponent.ts

  wildcardPorts: ConfigObject<string> = new ConfigObject({
    default: 'on',
    description: 'Show wildcard port hints (.*: port1, port2, etc.) in module instantiation',
    enum: ['on', 'off'],
  })
  ports: ConfigObject<string> = new ConfigObject({
    default: 'off',
    description: 'Show port type hints in module instantiation',
    enum: ['on', 'off', 'hover'],
  })

  // TOOD: implement
  // params: ConfigObject<string> = new ConfigObject({
  //   default: 'off',
  //   description: 'Show parameter type hints in module instantiation',
  //   enum: ['on', 'off', 'hover'],
  // })
}
