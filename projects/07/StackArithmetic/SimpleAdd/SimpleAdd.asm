// push constant 7
@7
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 8
@8
D=A
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

