# Desktop Player and Player-Page Ads

## Scope
- Rebuild the desktop watch-page area to match the supplied BingCloud reference: narrow sponsored rail, wide central player, and recommendations/episodes at right.
- Keep the existing responsive 468×60 banner above the player.
- Replace only the four ads beneath the player with the supplied 300×250 banner unit using key `7bdf2345688a935e14f4c7ff96269350`.
- Preserve the current compact four-across native ads elsewhere in the app and the current mobile player layout.

## Technical details
- Add a dedicated isolated player-page 300×250 ad component so the provider script and `atOptions` cannot collide.
- Scale each fixed-size creative to its desktop grid column without cropping.
- Apply the three-column reference layout only at desktop widths; movie recommendations and TV episodes remain the right rail.
- Verify movie and TV watch pages at desktop and phone sizes.
