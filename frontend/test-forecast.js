const xs = [0, 1, 2, 3, 4, 5];
const ys = [1, 2, 4, 8, 16, 32];
const degree = 2;

const n = xs.length;
const A = xs.map(x => Array.from({ length: degree + 1 }, (_, i) => Math.pow(x, i)));

const AT = A[0].map((_, col) => A.map(row => row[col]));
const ATA = AT.map(r => AT[0].map((_, j) => r.reduce((s, _, k) => s + r[k] * AT[j][k], 0)));
const ATy = AT.map(r => r.reduce((s, v, i) => s + v * ys[i], 0));

const mat = ATA.map((row, i) => [...row, ATy[i]]);
for (let i = 0; i <= degree; i++) {
    const pivot = mat[i][i];
    for (let k = i + 1; k <= degree; k++) {
        const f = mat[k][i] / pivot;
        mat[k] = mat[k].map((v, j) => v - f * mat[i][j]);
    }
}
const coeffs = new Array(degree + 1).fill(0);
for (let i = degree; i >= 0; i--) {
    coeffs[i] = mat[i][degree + 1];
    for (let j = i + 1; j <= degree; j++) {
        coeffs[i] -= mat[i][j] * coeffs[j];
    }
    coeffs[i] /= mat[i][i];
}

console.log(coeffs);
