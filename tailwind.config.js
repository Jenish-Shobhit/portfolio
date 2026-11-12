export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: Object.fromEntries([
        'background', 'foreground', 'card', 'card-foreground', 'popover',
        'popover-foreground', 'primary', 'primary-foreground', 'secondary',
        'secondary-foreground', 'muted', 'muted-foreground', 'accent',
        'accent-foreground', 'destructive', 'destructive-foreground', 'border',
        'input', 'ring',
      ].map(name => [name, `hsl(var(--${name}) / <alpha-value>)`])),
    },
  },
  plugins: [],
};
