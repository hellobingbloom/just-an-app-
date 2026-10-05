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

- Keep all native placements routed through `NativeAd` and all display banners routed through `Banner468Ad`, so provider code changes remain consistent across the app.
- Derive every BingBloom browser, PWA, Android, and iOS icon from the same official square artwork so brand marks never drift between platforms.
- Use shared desktop watch-ad and recommendation components on movie and TV watch pages; this keeps their reference layout and ad ordering consistent.
- Support leaderboard and rectangle formats through Banner468Ad; isolated frames prevent display-unit configuration collisions.
