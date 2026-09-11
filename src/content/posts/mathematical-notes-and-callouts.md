---
title: "Mathematical Notes and Structured Callouts"
description: "A compact rendering sample for equations, Obsidian-style callouts, tables, and technical prose."
publishDate: 2026-08-21
category: "Learning"
tags: ["Mathematics", "Markdown", "Obsidian"]
readingTime: 8
---

Technical notes often mix ordinary prose with notation. Inline expressions such as $e^{i\pi} + 1 = 0$ should sit naturally on the baseline without disturbing the rhythm of a paragraph.

## A Small Probability Model

Suppose a discrete random variable $X$ takes values $x_1, \ldots, x_n$. Its expected value is

$$
\mathbb{E}[X] = \sum_{i=1}^{n} x_i\,\mathbb{P}(X=x_i).
$$

> [!note]+ Assumptions and notation
>
> - The probabilities satisfy $p_i \ge 0$.
> - Their total is $\sum_{i=1}^{n} p_i = 1$.
> - Bold text, `inline code`, and [external references](https://en.wikipedia.org/wiki/Expected_value) remain usable inside the callout.

The variance can then be written in either of two equivalent forms:

$$
\operatorname{Var}(X)
= \mathbb{E}\!\left[(X-\mathbb{E}[X])^2\right]
= \mathbb{E}[X^2] - \mathbb{E}[X]^2.
$$

> [!tip] A useful computational shortcut
> Compute $\mathbb{E}[X^2]$ and $\mathbb{E}[X]$ separately when the distribution is already available as a table.

> [!warning]- A deliberately long formula
> On a narrow screen, this display should scroll within the article instead of widening the whole page:
>
> $$
> \mathcal{L}(\theta) = -\frac{1}{N}\sum_{i=1}^{N}\sum_{k=1}^{K} y_{ik}\log\!\left(\frac{\exp(z_{ik}/\tau)}{\sum_{j=1}^{K}\exp(z_{ij}/\tau)}\right) + \lambda\sum_{m=1}^{M}\lVert W_m\rVert_F^2.
> $$

## Linear Algebra in a Note

Aligned equations and matrices are common in research notes:

$$
\begin{aligned}
A &= Q\Lambda Q^{-1}, \\
A^k &= Q\Lambda^k Q^{-1}, \\
\exp(A) &= Q\,\operatorname{diag}(e^{\lambda_1},\ldots,e^{\lambda_n})\,Q^{-1}.
\end{aligned}
$$

> [!example] Reading the decomposition
> If $A$ is symmetric, $Q$ may be chosen orthogonal, so $Q^{-1}=Q^{\mathsf T}$. This turns several matrix operations into scalar operations on the eigenvalues.

## A Mixed-Content Checklist

| Element | What to verify | Narrow-screen behavior |
| --- | --- | --- |
| Inline math | Baseline and surrounding spacing | Wraps with the paragraph |
| Display math | KaTeX alignment and symbols | Scrolls horizontally when needed |
| Callout | Icon, title, border, and body | Stays inside the article column |
| Code | Monospace contrast and indentation | Scrolls without clipping the page |

```ts
export function mean(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
```

The rendered page should remain readable in both color themes and at desktop, tablet, and phone widths.
