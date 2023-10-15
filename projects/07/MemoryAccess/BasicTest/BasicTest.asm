// push constant 10
@10
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop local 0
@0
D=A
@LCL
D=M+D
@addr
M=D
@SP
AM=M-1
D=M
@addr
A=M
M=D

// push constant 21
@21
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 22
@22
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop argument 2
@2
D=A
@ARG
D=M+D
@addr
M=D
@SP
AM=M-1
D=M
@addr
A=M
M=D

// pop argument 1
@1
D=A
@ARG
D=M+D
@addr
M=D
@SP
AM=M-1
D=M
@addr
A=M
M=D

// push constant 36
@36
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop this 6
@6
D=A
@THIS
D=M+D
@addr
M=D
@SP
AM=M-1
D=M
@addr
A=M
M=D

// push constant 42
@42
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 45
@45
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop that 5
@5
D=A
@THAT
D=M+D
@addr
M=D
@SP
AM=M-1
D=M
@addr
A=M
M=D

// pop that 2
@2
D=A
@THAT
D=M+D
@addr
M=D
@SP
AM=M-1
D=M
@addr
A=M
M=D

// push constant 510
@510
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop temp 6
@SP
AM=M-1
D=M
@R11
M=D

// push local 0
@0
D=A
@LCL
A=M+D
D=M
@SP
A=M
M=D
@SP
M=M+1

// push that 5
@5
D=A
@THAT
A=M+D
D=M
@SP
A=M
M=D
@SP
M=M+1

// add (x, y)
@SP
AM=M-1
D=M // Load y into D register
@SP
AM=M-1
M=M+D // Compute x + y
@SP
M=M+1 // Advance stack pointer

// push argument 1
@1
D=A
@ARG
A=M+D
D=M
@SP
A=M
M=D
@SP
M=M+1

// sub (x, y)
@SP
AM=M-1
D=M // Load y into D register
@SP
AM=M-1
M=M-D // Compute x - y
@SP
M=M+1 // Advance stack pointer

// push this 6
@6
D=A
@THIS
A=M+D
D=M
@SP
A=M
M=D
@SP
M=M+1

// push this 6
@6
D=A
@THIS
A=M+D
D=M
@SP
A=M
M=D
@SP
M=M+1

// add (x, y)
@SP
AM=M-1
D=M // Load y into D register
@SP
AM=M-1
M=M+D // Compute x + y
@SP
M=M+1 // Advance stack pointer

// sub (x, y)
@SP
AM=M-1
D=M // Load y into D register
@SP
AM=M-1
M=M-D // Compute x - y
@SP
M=M+1 // Advance stack pointer

// push temp 6
@R11
D=M
@SP
A=M
M=D
@SP
M=M+1

// add (x, y)
@SP
AM=M-1
D=M // Load y into D register
@SP
AM=M-1
M=M+D // Compute x + y
@SP
M=M+1 // Advance stack pointer

