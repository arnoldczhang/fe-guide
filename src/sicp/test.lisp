(defun (square x) (* x x))

(defun (sum-of-square x y)
  (+ square(x) square(y)))

(defun (f a)
  (cond ((> a 1) (sum-of-square((+a 1) (*a 2))))
    (else (sum-of-square((+a 1) (*a 2)))))

(f 5)