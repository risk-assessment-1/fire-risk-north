import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "lite-youtube": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          videoid?: string;
          videotitle?: string;
        },
        HTMLElement
      >;
    }
  }
}
