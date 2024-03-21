import type { RatingMatrix } from ".";
import { alpha, coincidenceMatrix } from ".";

const u = undefined;

describe("small example", () => {
  const ratingMatrix: RatingMatrix<number> = [
    [1, 2, 1],
    [1, 1, 1],
    [1, 2, 3],
  ];

  test("alpha", () => {
    const expectedAlpha = 0.2;
    expect(alpha(ratingMatrix)).toBeCloseTo(expectedAlpha);
  });
});

describe("Wikipedia example", () => {
  // https://en.wikipedia.org/wiki/Krippendorff%27s_alpha#A_computational_example
  const ratingMatrix: RatingMatrix<number> = [
    [u, u, u, u, u, 3, 4, 1, 2, 1, 1, 3, 3, u, 3],
    [1, u, 2, 1, 3, 3, 4, 3, u, u, u, u, u, u, u],
    [u, u, 2, 1, 3, 4, 4, u, 2, 1, 1, 3, 3, u, 4],
  ];

  test("coincidence matrix", () => {
    const expectedCoincidenceMatrix = [
      [6, u, 1, u],
      [u, 4, u, u],
      [1, u, 7, 2],
      [u, u, 2, 3],
    ];
    expect(coincidenceMatrix(ratingMatrix)).toEqual(expectedCoincidenceMatrix);
  });

  test("alpha", () => {
    const expectedAlpha = 0.691;
    expect(alpha(ratingMatrix)).toBeCloseTo(expectedAlpha, 3);
  });
});
