<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Chíl site is a single page at `/`; flavour data lives in `src/lib/flavors.ts` and the active flavour colour is pushed to the `--flavor` CSS variable, so all themed UI must read `var(--flavor)` rather than per-flavour classes.
- Hero is 2.5D (CSS transforms + one canvas for particles), not three.js, because only flat can photos exist; switch to R3F only if real 3D can models are supplied.
