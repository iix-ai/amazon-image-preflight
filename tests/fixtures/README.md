# Image fixtures

The fixture set covers the six required cases:

1. `valid-2000x2000.png`: readable 2000×2000 white-background image with a centered subject.
2. `too-small-400x400.png`: image below the minimum dimension check.
3. `transparent-2000x2000.png`: PNG with transparent background pixels.
4. `non-white-background-2000x2000.png`: readable image with a gray background.
5. `product-too-small-2000x2000.png`: centered subject occupying a small portion of the frame.
6. `borderline-2000x2000.png`: centered subject near the visual-estimate threshold.

The unit tests use compact synthetic pixel buffers for speed and deterministic tolerance checks. These PNGs are kept for browser smoke/manual inspection and map to the same cases.
