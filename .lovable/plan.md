# Replace ads and standardize the official BingBloom icon

## Scope
- Replace every active native ad script with the supplied `bancadeltempoidea.org` native unit and matching container ID.
- Replace every active banner format with the supplied 468×60 banner, preserving responsive scaling on phones.
- Use the uploaded BingBloom artwork as the single official logo across the website, browser favicon, installable web app, Android app, and iOS app.
- Correct the generated web-app manifest branding so it consistently says BingBloom.

## Implementation details
- Keep third-party ad scripts isolated in their existing frames so multiple placements do not conflict or blank the page.
- Generate optimized square icon sizes from the uploaded image without stretching it, including browser, web-app, Android launcher, and iOS App Store sizes.
- Replace visible in-app BingBloom logo references with the same official artwork.
- Do not change ad placement, page layout, or unrelated imagery.

## Verification
- Check that no previous ad domains or keys remain in active source.
- Confirm the official image is used by all icon and logo references.
- Verify the current phone preview, app manifest, and build diagnostics.
