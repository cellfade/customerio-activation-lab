# Pluma integration boundary

This prototype uses exact public Pluma token values and annotates component seams with `data-pluma-component` so the production replacement surface is inspectable.

The packages are private: anonymous npm lookups for `@customerio/pluma-components`, `@customerio/pluma-tokens`, `@customerio/pluma-cli`, and `@customerio/pluma-mcp` return 404. Pluma's MCP instructions also require a GitHub token and authenticated `.npmrc`. The prototype therefore does not claim to import packages it cannot resolve.

With Customer.io repository access, replace the seams as follows:

```tsx
import {
  Button,
  NavItem,
  OptionCard,
  OptionCardGroup,
  Modal,
  ModalBody,
  ModalFooter,
  useModal,
  Drawer,
  DrawerBody,
  DrawerFooter,
  useDrawer,
} from '@customerio/pluma-components/react'
```

- `data-pluma-component="NavItem"` → `NavItem`
- `data-pluma-component="Button"` → `Button`
- `data-pluma-component="OptionCardGroup"` → `OptionCardGroup`
- `data-pluma-component="OptionCard"` → `OptionCard`
- `data-pluma-component="ManagedModal"` → modal manager + `Modal`
- `data-pluma-component="ManagedDrawer"` → drawer manager + `Drawer`

The exact public token names in `src/styles/tokens.css` mirror Pluma `themeVars` paths. Inside the product repository, replace the CSS aliases with Vanilla Extract token accessors rather than copying raw values.

Recommended authenticated audit:

```bash
pnpm dlx @customerio/pluma-cli@latest upgrade --list
pnpm dlx @customerio/pluma-cli@latest upgrade --codemod button-variant-rename react --dry ./src
```

The dry run should be mandatory before applying a codemod.
