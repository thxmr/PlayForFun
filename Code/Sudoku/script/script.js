function generateSudoku()
{
    let sudoku = [
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['','','','','','','','','']
    ];
    
    for(let row=0;row<sudoku[0].length;row++)
    {
        fillRow(sudoku,row);
    }
    return sudoku;
}

function isNumberInCol(num,sudoku,col)
{
    for(let i=1;i<=sudoku[0].length;i++)
    {
        if(document.getElementById("r"+i+"c"+(col+1)).innerHTML==num)
        {
            return true;
        }
    }
    return false;
}

function isNumberInRow(num,sudoku,row)
{
    for(let i=1;i<=sudoku[0].length;i++)
    {
        if(document.getElementById("r"+(row+1)+"c"+i).innerHTML==num)
        {
            return true;
        }
    }
    return false;
}

function isNumberInSquare(num,sudoku,row,col)
{
    let squareNum = document.getElementById("r"+(row+1)+"c"+(col+1)).classList[1];
    for(let i=0;i<sudoku[0].length;i++)
    {
        if(document.getElementsByClassName(squareNum)[i].innerHTML == num)
        {
            return true;
        }
    }
    return false;         
}

function isValid(num,sudoku,row,col)
{
    if(!isNumberInCol(num,sudoku,col)&&!isNumberInRow(num,sudoku,row)&&!isNumberInSquare(num,sudoku,row,col))
    {
        return true;
    }
}

function writeSudoku(num,row,col)
{
    document.getElementById("r"+(row+1)+"c"+(col+1)).innerHTML = num;
}

function getPossibilities(sudoku,row)
{
    let numbers = [1,2,3,4,5,6,7,8,9];
    let nbPossibles = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
        ];
    for(let col=0;col<sudoku[0].length;col++)
    {
        for(let j=0;j<numbers.length;j++)
        {
            if(isValid(numbers[j],sudoku,row,col))
            {
                nbPossibles[col].push(numbers[j]);
            }
        }
        
    }
    return nbPossibles;
}

function fillRow(sudoku,row)
{
    for(let col=0;col<sudoku[0].length;col++)
    {
        let numbers = [1,2,3,4,5,6,7,8,9];
        numbers.sort(() => Math.random() - 0.5);
        while(sudoku[row][col]=='')
        {
            let index = Math.floor(Math.random() * numbers.length-1);
            if(index==-1){index=0;}
            let numgen = numbers[index];
            if(isValid(numgen,sudoku,row,col))
            {
                if(numgen==undefined){
                    sudoku[row][col]=999;
                    writeSudoku(999,row,col);
                }else{
                    sudoku[row][col]=numgen;
                    writeSudoku(numgen,row,col);
                }
            }
            numbers.splice(index,1);
        }
    }
}


console.log(generateSudoku());

