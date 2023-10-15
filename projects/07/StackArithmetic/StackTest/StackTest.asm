// push constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1

// eq (x,y)
@SP
AM=M-1 // Point to y
D=M // Load y into D register
@SP
AM=M-1 // Point to x
D=M-D // Load result of 'x - y' into D register
@CONDITION_MET_0
D;JEQ // Jump if condition is met
@SP
A=M // Point to the top of the stack
M=0   // Set to false (0)
@CONTINUE_0
0;JMP // Jump to CONTINUE
(CONDITION_MET_0)
@SP
A=M // Point to the top of the stack
M=-1 // Set to true (-1)
(CONTINUE_0)
@SP
M=M+1 // Advance stack pointer

// push constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 16
@16
D=A
@SP
A=M
M=D
@SP
M=M+1

// eq (x,y)
@SP
AM=M-1 // Point to y
D=M // Load y into D register
@SP
AM=M-1 // Point to x
D=M-D // Load result of 'x - y' into D register
@CONDITION_MET_1
D;JEQ // Jump if condition is met
@SP
A=M // Point to the top of the stack
M=0   // Set to false (0)
@CONTINUE_1
0;JMP // Jump to CONTINUE
(CONDITION_MET_1)
@SP
A=M // Point to the top of the stack
M=-1 // Set to true (-1)
(CONTINUE_1)
@SP
M=M+1 // Advance stack pointer

// push constant 16
@16
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1

// eq (x,y)
@SP
AM=M-1 // Point to y
D=M // Load y into D register
@SP
AM=M-1 // Point to x
D=M-D // Load result of 'x - y' into D register
@CONDITION_MET_2
D;JEQ // Jump if condition is met
@SP
A=M // Point to the top of the stack
M=0   // Set to false (0)
@CONTINUE_2
0;JMP // Jump to CONTINUE
(CONDITION_MET_2)
@SP
A=M // Point to the top of the stack
M=-1 // Set to true (-1)
(CONTINUE_2)
@SP
M=M+1 // Advance stack pointer

// push constant 892
@892
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1

// lt (x,y)
@SP
AM=M-1 // Point to y
D=M // Load y into D register
@SP
AM=M-1 // Point to x
D=M-D // Load result of 'x - y' into D register
@CONDITION_MET_3
D;JLT // Jump if condition is met
@SP
A=M // Point to the top of the stack
M=0   // Set to false (0)
@CONTINUE_3
0;JMP // Jump to CONTINUE
(CONDITION_MET_3)
@SP
A=M // Point to the top of the stack
M=-1 // Set to true (-1)
(CONTINUE_3)
@SP
M=M+1 // Advance stack pointer

// push constant 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 892
@892
D=A
@SP
A=M
M=D
@SP
M=M+1

// lt (x,y)
@SP
AM=M-1 // Point to y
D=M // Load y into D register
@SP
AM=M-1 // Point to x
D=M-D // Load result of 'x - y' into D register
@CONDITION_MET_4
D;JLT // Jump if condition is met
@SP
A=M // Point to the top of the stack
M=0   // Set to false (0)
@CONTINUE_4
0;JMP // Jump to CONTINUE
(CONDITION_MET_4)
@SP
A=M // Point to the top of the stack
M=-1 // Set to true (-1)
(CONTINUE_4)
@SP
M=M+1 // Advance stack pointer

// push constant 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1

// lt (x,y)
@SP
AM=M-1 // Point to y
D=M // Load y into D register
@SP
AM=M-1 // Point to x
D=M-D // Load result of 'x - y' into D register
@CONDITION_MET_5
D;JLT // Jump if condition is met
@SP
A=M // Point to the top of the stack
M=0   // Set to false (0)
@CONTINUE_5
0;JMP // Jump to CONTINUE
(CONDITION_MET_5)
@SP
A=M // Point to the top of the stack
M=-1 // Set to true (-1)
(CONTINUE_5)
@SP
M=M+1 // Advance stack pointer

// push constant 32767
@32767
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1

// gt (x,y)
@SP
AM=M-1 // Point to y
D=M // Load y into D register
@SP
AM=M-1 // Point to x
D=M-D // Load result of 'x - y' into D register
@CONDITION_MET_6
D;JGT // Jump if condition is met
@SP
A=M // Point to the top of the stack
M=0   // Set to false (0)
@CONTINUE_6
0;JMP // Jump to CONTINUE
(CONDITION_MET_6)
@SP
A=M // Point to the top of the stack
M=-1 // Set to true (-1)
(CONTINUE_6)
@SP
M=M+1 // Advance stack pointer

// push constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 32767
@32767
D=A
@SP
A=M
M=D
@SP
M=M+1

// gt (x,y)
@SP
AM=M-1 // Point to y
D=M // Load y into D register
@SP
AM=M-1 // Point to x
D=M-D // Load result of 'x - y' into D register
@CONDITION_MET_7
D;JGT // Jump if condition is met
@SP
A=M // Point to the top of the stack
M=0   // Set to false (0)
@CONTINUE_7
0;JMP // Jump to CONTINUE
(CONDITION_MET_7)
@SP
A=M // Point to the top of the stack
M=-1 // Set to true (-1)
(CONTINUE_7)
@SP
M=M+1 // Advance stack pointer

// push constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1

// gt (x,y)
@SP
AM=M-1 // Point to y
D=M // Load y into D register
@SP
AM=M-1 // Point to x
D=M-D // Load result of 'x - y' into D register
@CONDITION_MET_8
D;JGT // Jump if condition is met
@SP
A=M // Point to the top of the stack
M=0   // Set to false (0)
@CONTINUE_8
0;JMP // Jump to CONTINUE
(CONDITION_MET_8)
@SP
A=M // Point to the top of the stack
M=-1 // Set to true (-1)
(CONTINUE_8)
@SP
M=M+1 // Advance stack pointer

// push constant 57
@57
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 31
@31
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 53
@53
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

// push constant 112
@112
D=A
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

// neg
@SP
AM=M-1
M=-M
@SP
M=M+1 // Advance stack pointer

// and (x,y)
@SP
AM=M-1 // Point to y
D=M // Load y into D register
@SP
AM=M-1 // Point to x
D=D&M // Compute
@SP
A=M // Point to the top of the stack
M=D // Save computation result to the top of the stack
@SP
M=M+1 // Advance stack pointer

// push constant 82
@82
D=A
@SP
A=M
M=D
@SP
M=M+1

// or (x,y)
@SP
AM=M-1 // Point to y
D=M // Load y into D register
@SP
AM=M-1 // Point to x
D=D|M // Compute
@SP
A=M // Point to the top of the stack
M=D // Save computation result to the top of the stack
@SP
M=M+1 // Advance stack pointer

// not (x)
@SP
AM=M-1 // Point to x
D=M // Load x into D register
@SP
A=M // Point to the top of the stack
M=!D // Save computation result to the top of the stack
@SP
M=M+1 // Advance stack pointer

