// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.
@SCREEN
D=A
@addr
M=D // address = 16384 (base address of Hack screen)

@i
M=0 // i = 0

@8192
D=A
@n
M=D // n = 8192 (last screen address)

(LOOP)
    @KBD
    D=M // save keyboard input value to D register (24576)

    @FILL
    D;JGT // jump to FILL loop if any key is pressed

    @CLEAR
    D;JEQ // jump to CLEAR loop if no key is pressed

    @LOOP
    0;JMP

(FILL)
    @i
    D=M
    @n
    D=D-M
    @FINISH_PAINTING
    D;JGE // if i >= n

    @addr
    A=M
    M=-1

    @i
    M=M+1

    @i
    D=M
    @addr
    M=M+1

    @FILL
    0;JMP

(CLEAR)
    @i
    D=M
    @n
    D=D-M
    @FINISH_PAINTING
    D;JGE // if i >= n

    @addr
    A=M
    M=0

    @i
    M=M+1

    @i
    D=M
    @addr
    M=M+1

    @CLEAR
    0;JMP

(FINISH_PAINTING)
    @i
    M=0
    @SCREEN
    D=A
    @addr
    M=D
    @LOOP
    D;JGE // if i >= n