# Changelog

## [5.0.0] - 2021-03-07

### Changed

- **Breaking:** modernize syntax (drops node 8) ([#26](https://github.com/Level/party/issues/26)) ([`9615cac`](https://github.com/Level/party/commit/9615cac), [`b0aa870`](https://github.com/Level/party/commit/b0aa870)) (Robert Nagy)
- Bump `subleveldown` from `4.1.4` to `5.0.1` ([#24](https://github.com/Level/party/issues/24)) ([`0732684`](https://github.com/Level/party/commit/0732684)) (Vincent Weevers).

## [4.0.0] - 2019-12-08

### Changed

- **Breaking**: upgrade to latest Level modules ([#20](https://github.com/Level/party/issues/20)) ([`17d03fb`](https://github.com/Level/party/commit/17d03fb)) ([**@vweevers**](https://github.com/vweevers))
- Move repository from [**@substack**](https://github.com/substack) to [**@Level**](https://github.com/Level) ([`b43e233`](https://github.com/Level/party/commit/b43e233)) ([**@substack**](https://github.com/substack), [**@vweevers**](https://github.com/vweevers))
- Switch to `standard` code style ([`3f4a8fb`](https://github.com/Level/party/commit/3f4a8fb)) ([**@vweevers**](https://github.com/vweevers))

### Added

- Add `subleveldown` test ([#20](https://github.com/Level/party/issues/20)) ([`c9bb2af`](https://github.com/Level/party/commit/c9bb2af)) ([**@vweevers**](https://github.com/vweevers))

### Removed

- **Breaking**: Drop `level-sublevel` support ([#20](https://github.com/Level/party/issues/20)) ([`77b60ef`](https://github.com/Level/party/commit/77b60ef)) ([**@vweevers**](https://github.com/vweevers)). In preference of `subleveldown`.
- **Breaking**: Drop node &lt; 8 ([#20](https://github.com/Level/party/issues/20)) ([`5e0e7f5`](https://github.com/Level/party/commit/5e0e7f5)) ([**@vweevers**](https://github.com/vweevers))

## [3.0.4] - 2016-01-10

### Fixed

- Bump `multileveldown` to prevent npm dedupe ([`f3964ee`](https://github.com/Level/party/commit/f3964ee)) ([**@mafintosh**](https://github.com/mafintosh))

## [3.0.3] - 2016-01-10

### Fixed

- Fix edge case after leader election ([`921b329`](https://github.com/Level/party/commit/921b329)) ([**@mafintosh**](https://github.com/mafintosh))

## [3.0.2] - 2016-01-09

### Fixed

- Bump `multileveldown` to prevent npm dedupe ([`efefa3f`](https://github.com/Level/party/commit/efefa3f)) ([**@mafintosh**](https://github.com/mafintosh))

## [3.0.1] - 2016-01-09

### Fixed

- Update travis ([`974fae4`](https://github.com/Level/party/commit/974fae4), [`5248dc3`](https://github.com/Level/party/commit/5248dc3)) ([**@mafintosh**](https://github.com/mafintosh))

## [3.0.0] - 2016-01-09

### Changed

- **Breaking**: upgrade `multileveldown` (and `levelup`) ([`6ed2b8a`](https://github.com/Level/party/commit/6ed2b8a)) ([**@mafintosh**](https://github.com/mafintosh))

## [2.1.2] - 2015-06-29

### Fixed

- Use `level` instead of `level-prebuilt` ([#7](https://github.com/Level/party/issues/7)) ([`cbe24cb`](https://github.com/Level/party/commit/cbe24cb)) ([**@mafintosh**](https://github.com/mafintosh))

## [2.1.1] - 2015-05-04

### Added

- Document seamless failover, snapshotting & windows support ([`b22ad47`](https://github.com/Level/party/commit/b22ad47), [`e20f7cf`](https://github.com/Level/party/commit/e20f7cf)) ([**@mafintosh**](https://github.com/mafintosh))

### Fixed

- Use the `ref` option of `multileveldown` to not hang event loop ([`196dde8`](https://github.com/Level/party/commit/196dde8)) ([**@mafintosh**](https://github.com/mafintosh))

## [2.1.0] - 2015-04-25

### Changed

- Use `level-prebuilt` to avoid compilation ([`a80bb0c`](https://github.com/Level/party/commit/a80bb0c), [`40ba6ca`](https://github.com/Level/party/commit/40ba6ca)) ([**@mafintosh**](https://github.com/mafintosh))

### Added

- Add Windows support using named pipes ([`87f4672`](https://github.com/Level/party/commit/87f4672)) ([**@mafintosh**](https://github.com/mafintosh))

## [2.0.0] - 2015-04-25

### Changed

- **Breaking**: use `multileveldown` instead of `multilevel` to get seamless failover ([`64bd1dd`](https://github.com/Level/party/commit/64bd1dd)) ([**@mafintosh**](https://github.com/mafintosh))

### Added

- Add read-stream examples ([`b45e4a7`](https://github.com/Level/party/commit/b45e4a7)) ([**@mafintosh**](https://github.com/mafintosh))
- Print leader in get/put examples ([`d8c3dbd`](https://github.com/Level/party/commit/d8c3dbd)) ([**@mafintosh**](https://github.com/mafintosh))

## [1.0.1] - 2014-09-25

No changes.

## [1.0.0] - 2014-09-25

### Changed

- Upgrade dependencies ([`b068521`](https://github.com/Level/party/commit/b068521)) ([**@substack**](https://github.com/substack))

### Added

- Add `bytewise` & `sublevel` integration tests ([`f0d7f73`](https://github.com/Level/party/commit/f0d7f73), [`93f1300`](https://github.com/Level/party/commit/93f1300), [`d48ad37`](https://github.com/Level/party/commit/d48ad37), [`3f17d79`](https://github.com/Level/party/commit/3f17d79), [`decff64`](https://github.com/Level/party/commit/decff64)) ([**@substack**](https://github.com/substack))

### Fixed

- Fix `bytewise` & `sublevel` integration ([`7344bf2`](https://github.com/Level/party/commit/7344bf2), [`439b75d`](https://github.com/Level/party/commit/439b75d), [`16a4ad9`](https://github.com/Level/party/commit/16a4ad9)) ([**@substack**](https://github.com/substack))

## [0.0.4] - 2014-04-02

### Changed

- Discard stream errors ([`115210e`](https://github.com/Level/party/commit/115210e)) ([**@substack**](https://github.com/substack))

## [0.0.3] - 2014-02-27

### Changed

- Upgrade `level-proxy` ([`f8b1f5b`](https://github.com/Level/party/commit/f8b1f5b)) ([**@substack**](https://github.com/substack))

## [0.0.2] - 2014-02-18

### Added

- Add image to readme ([`244291e`](https://github.com/Level/party/commit/244291e)) ([**@substack**](https://github.com/substack))

### Fixed

- Fix `tmpDir()` for node 0.8 ([`044dbc4`](https://github.com/Level/party/commit/044dbc4)) ([**@substack**](https://github.com/substack))

## [0.0.1] - 2014-02-17

### Changed

- Use `~` for dependencies instead of `^` ([`facd354`](https://github.com/Level/party/commit/facd354)) ([**@substack**](https://github.com/substack))

## 0.0.0 - 2014-02-17

Initial release :seedling:.

[5.0.0]: https://github.com/Level/party/releases/tag/v5.0.0

[4.0.0]: https://github.com/Level/party/releases/tag/v4.0.0

[3.0.4]: https://github.com/Level/party/releases/tag/v3.0.4

[3.0.3]: https://github.com/Level/party/releases/tag/v3.0.3

[3.0.2]: https://github.com/Level/party/releases/tag/v3.0.2

[3.0.1]: https://github.com/Level/party/releases/tag/v3.0.1

[3.0.0]: https://github.com/Level/party/releases/tag/v3.0.0

[2.1.2]: https://github.com/Level/party/releases/tag/v2.1.2

[2.1.1]: https://github.com/Level/party/releases/tag/v2.1.1

[2.1.0]: https://github.com/Level/party/releases/tag/v2.1.0

[2.0.0]: https://github.com/Level/party/releases/tag/v2.0.0

[1.0.1]: https://github.com/Level/party/releases/tag/1.0.1

[1.0.0]: https://github.com/Level/party/releases/tag/1.0.0

[0.0.4]: https://github.com/Level/party/releases/tag/0.0.4

[0.0.3]: https://github.com/Level/party/releases/tag/0.0.3

[0.0.2]: https://github.com/Level/party/releases/tag/0.0.2

[0.0.1]: https://github.com/Level/party/releases/tag/0.0.1
