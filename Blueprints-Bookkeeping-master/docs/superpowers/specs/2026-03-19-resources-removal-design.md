# Resources removal design

## Goal

Remove the public Resources experience entirely, including the `/resources` page, downloadable PDFs, and any site messaging or routing that advertises those assets.

## Scope

- Delete the public Resources page and route.
- Remove public navigation links and on-page promotional sections that point visitors to Resources.
- Remove the public downloads API endpoint because it only served the deleted PDFs.
- Delete the downloadable PDF assets and the local generation scripts that existed only to build those files.
- Update sitemap and newsletter welcome messaging so the site no longer promises free resources.

## Notes

- This is a hard removal, not a redirect or soft hide.
- Contract/document templates used by internal admin tooling are out of scope because they are unrelated to the public Resources library.
