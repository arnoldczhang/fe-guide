(define (square x) (* x x))

(define (sum-of-square x y)
  (+ square(x) square(y)))

(define (f a)
  (sum-of-square((+a 1) (*a 2))))