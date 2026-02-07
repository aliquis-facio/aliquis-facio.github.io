---
layout: post
comments: true
sitemap:
    changefreq: daily
    priority: 0.5

title: "[COD] COD 정리"
excerpt: "COD 개요"

date: 2022-09-30
last_modified_at: 

categories: [COD]
tags: [COD, MIPS, SPIM]
---

<!-- markdownlint-disable MD004 MD025 MD033-->

1. Computer Architecture: 컴퓨터 구조
2. ISA(Instruction Set Architecture): 명령어 집합 구조
    - MIPS
    - RISC I, II -> SPARC
    - ARM
    - x86 family (intel)

# Inside the Processor (CPU)

* Datapath: performs operations on data
* Control: sequences datapath, memory, etc
* Cache memory: Small fast SRAM memory for immediate access to data

# The MIPS Instruction Set

## Types of Instructions

### Arithmetic / Logic Instructions = ALU (Arithmetic Logic Unit) Operations

#### Arithmetic Instructions

1. add
2. sub
3. mult
4. div

#### Logical Instructions

1. and
2. or
3. nor
4. sll
5. srl

### Data Transfer Instructions = Load / Store Instructions

1. lw
2. sw
3. lui

### Branch Instructions = Control Transfer Instructions

1. jr
2. j
3. jal
4. beq
5. bne
6. slt
