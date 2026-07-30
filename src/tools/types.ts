export interface ToolDefinition<TOptions extends Record<string, unknown>> {
    name: string;
    label: string;
    icon: string;
    options: {
      [K in keyof TOptions]: {
        type: 'string' | 'number' | 'color' | 'boolean' | 'json';
        defaultValue: TOptions[K];
      };
    };
    renderers: {
      email: (opts: TOptions) => string;
      web: (opts: TOptions) => unknown;
      document: (opts: TOptions) => string;
    };
  }
  
  // renderers become exporter callbacks when unlayer-sdk registerTool()
  // is integrated — upgrade-ready shape