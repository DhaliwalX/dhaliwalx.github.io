Simplest example to showcase the performance difference between OpenCL (using GPUs) and Numpy (with CPU) for vector processing.


```python
import pyopencl as cl
import numpy as np
import pyopencl.array
```

`interactive=True` allows us to choose a configuration from various configurations present in a system.


```python
ctx = cl.create_some_context(interactive=True)
```

    Choose platform:
    [0] <pyopencl.Platform 'NVIDIA CUDA' at 0x2a8ca50>
    [1] <pyopencl.Platform 'Intel Gen OCL Driver' at 0x7fa9c756e4e0>
    Choice [0]:0
    Set the environment variable PYOPENCL_CTX='0' to avoid being asked again.


`pyopencl` provides an ipython extension which reduces a lot of boilerplate code


```python
%load_ext pyopencl.ipython_ext
```

Write a kernel function which will add two vectors and store the result to C.

$$
    C(i) = A(i) + B(i), \text{for i} \in [0, n)
$$


```python
%%cl_kernel -o "-cl-fast-relaxed-math"
__kernel void sum_vector(__global const float *A, __global const float *B, __global float *C) {
    int gid = get_global_id(0);
    C[gid] = A[gid] + B[gid];
}
```

Here, I am creating three buffers $A$ (`a`), $B$ (`b`) and $C$ (`c`). `a` and `b` are allocated memory on both Host (CPU) and device (GPU). `c` is allocated memory on device.


```python
n = 100000000
queue = cl.CommandQueue(ctx)
a_host = np.random.randn(n).astype(np.float32)
a = cl.array.to_device(queue, a_host)

b_host = np.random.randn(n).astype(np.float32)
b = cl.array.to_device(queue, b_host)
c = cl.array.empty_like(a)
```

Simple benchmark code for measuring performance of OpenCL (backed by GPU)


```python
def _run_sum():
    event = sum_vector(queue, (n,), None, a.data, b.data, c.data)
    cl.wait_for_events([event])
    
%timeit _run_sum()
```

    8.08 ms ± 94.4 µs per loop (mean ± std. dev. of 7 runs, 100 loops each)



```python
%timeit a_host + b_host
```

    89.7 ms ± 308 µs per loop (mean ± std. dev. of 7 runs, 10 loops each)


So, OpenCL code runs 10X faster than normal Numpy code.


```python
a_host + b_host
```




    array([ 0.4168285 , -0.5317373 , -0.55536956, ..., -1.4577644 ,
            2.5533843 ,  1.0661736 ], dtype=float32)




```python
c
```




    array([ 0.4168285 , -0.5317373 , -0.55536956, ..., -1.4577644 ,
            2.5533843 ,  1.0661736 ], dtype=float32)




```python

```
