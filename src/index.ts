/**
 * An implementation of Krippendorff's alpha for measuring inter-rater agreement,
 * based on the Wikipedia article (https://en.wikipedia.org/wiki/Krippendorff's_alpha).
 *
 * The implementation is very basic and not optimized for performance.
 */

/** A rating is either a number or a string. */
type Rating = number | string;

/** Ratings provided by a single rater. */
export type Ratings<R extends Rating> = (R | undefined)[];

/**
 * Ratings provided by multiple raters.
 *
 * Each row corresponds to the ratings provided by a single rater,
 * each column to the ratings provided for a single sample.
 */
export type RatingMatrix<R extends Rating> = Ratings<R>[];

/** A distance metric that compares two ratings. */
export type MetricFunction<R extends Rating> = (a: R, b: R) => number;

/** A very simple distance metric that returns 0 if the ratings are identical and 1 otherwise. */
export function identityMetric<R extends Rating>(a: R, b: R): number {
  return a === b ? 0 : 1;
}

/** Collect all distinct ratings present in the given matrix. */
function collectRatings<R extends Rating>(ratingMatrix: RatingMatrix<R>): R[] {
  const values = new Set<R>();
  for (const ratings of ratingMatrix) {
    for (const rating of ratings) {
      if (rating !== undefined) {
        values.add(rating);
      }
    }
  }
  return Array.from(values).sort();
}

/**
 * Get the total number of ratings for the given sample.
 *
 * This is referred to as $m_u$ (where $u$ is the sample) in the Wikipedia article.
 */
function numberOfRatingsFor<R extends Rating>(
  ratingMatrix: RatingMatrix<R>,
  sample: number,
): number {
  let count = 0;
  for (const ratings of ratingMatrix) {
    if (ratings[sample] !== undefined) {
      count++;
    }
  }
  return count;
}

/**
 * Count the number of times any sample is rated `a` by some rater, only considering samples with at least two ratings.
 */
function numberOfRatings<R extends Rating>(
  ratingMatrix: RatingMatrix<R>,
  a: R,
): number {
  let count = 0;
  for (let sample = 0; sample < ratingMatrix[0].length; sample++) {
    if (numberOfRatingsFor(ratingMatrix, sample) >= 2) {
      for (const ratings of ratingMatrix) {
        if (ratings[sample] === a) {
          count++;
        }
      }
    }
  }
  return count;
}

/**
 * Count the number of times the same `sample` is rated as `a` by one rater and as `b` by another.
 */
function numberOfRatingPairs<R extends Rating>(
  ratingMatrix: RatingMatrix<R>,
  sample: number,
  a: R,
  b: R,
): number {
  let count = 0;
  for (let i = 0; i < ratingMatrix.length; i++) {
    for (let j = 0; j < ratingMatrix.length; j++) {
      if (
        i !== j &&
        ratingMatrix[i][sample] === a &&
        ratingMatrix[j][sample] === b
      ) {
        count++;
      }
    }
  }

  return count;
}

/**
 * Compute the coincidence matrix for the given rating matrix.
 */
export function coincidenceMatrix<R extends Rating>(
  ratingMatrix: RatingMatrix<R>,
): (number | undefined)[][] {
  const values = collectRatings(ratingMatrix);
  const result = new Array(values.length).fill(undefined).map(() => {
    const row: (number | undefined)[] = new Array(values.length).fill(
      undefined,
    );
    return row;
  });
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    for (let j = i; j < values.length; j++) {
      const w = values[j];
      let frequency: number | undefined;
      for (let sample = 0; sample < ratingMatrix[0].length; sample++) {
        const numRatings = numberOfRatingsFor(ratingMatrix, sample);
        if (numRatings < 2) {
          continue;
        }
        const occurrencePairs = numberOfRatingPairs(ratingMatrix, sample, v, w);
        if (occurrencePairs > 0) {
          frequency = (frequency ?? 0) + occurrencePairs / (numRatings - 1);
        }
      }
      result[i][j] = frequency;
      result[j][i] = frequency;
    }
  }
  return result;
}

/**
 * Compute Krippendorff's alpha for the given rating matrix.
 *
 * @param ratingMatrix The matrix of ratings provided by multiple raters,
 *                     where each row corresponds to the ratings provided by a single rater.
 * @param metric       A distance metric that compares two ratings, defaults to the identity metric.
 */
export function alpha<R extends Rating>(
  ratingMatrix: RatingMatrix<R>,
  metric = identityMetric<R>,
) {
  const values = collectRatings(ratingMatrix);
  const c = coincidenceMatrix(ratingMatrix);
  let observedDisagreement = 0;
  let expectedDisagreement = 0;
  let totalNumberOfRatings = 0;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    totalNumberOfRatings += numberOfRatings(ratingMatrix, v);
    for (let j = i; j < values.length; j++) {
      const w = values[j];
      const cij = c[i][j];
      if (cij !== undefined) {
        observedDisagreement += cij * metric(v, w);
      }

      const numRatingsV = numberOfRatings(ratingMatrix, v);
      const numRatingsW = numberOfRatings(ratingMatrix, w);
      expectedDisagreement += numRatingsV * numRatingsW * metric(v, w);
    }
  }
  expectedDisagreement /= totalNumberOfRatings - 1;

  return 1 - observedDisagreement / expectedDisagreement;
}
