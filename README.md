# krippendorff

An implementation of Krippendorff's alpha, based on the [Wikipedia article](https://en.wikipedia.org/wiki/Krippendorff's_alpha).

Ratings can be numbers or strings; missing values are represented by `undefined`.

## Installation

```sh
npm install krippendorff
```

## Usage

```js
import { alpha } from "krippendorff";

const ratingMatrix = [
  [1, 2, 1], // ratings by first rater
  [1, 1, 1], // ratings by second rater
  [1, 2], // ratings by third rater; note missing rating for third sample
];

console.log(alpha(ratingMatrix)); // 0.41666666666666663
```

## License

This project is licensed under the terms of the MIT open source license. Please refer to [LICENSE](LICENSE) for the full terms.

## Maintainers

- Max Schaefer <max-schaefer@github.com>

## Support

This is a side project of mine and is not officially supported. However, if you have questions or feedback, feel free to file an issue and I will do my best to respond.
