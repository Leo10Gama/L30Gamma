//Store the atomic masses of all elements corresponding to their atomic symbols
const atomicMasses = new Map([["H", 1.00797], ["He", 4.00260], ["Li", 6.941], ["Be", 9.01218], ["B", 10.81], ["C", 12.011], ["N", 14.0067], ["O", 15.9994],
["F", 18.998403], ["Ne", 20.179], ["Na", 22.98977], ["Mg", 24.305], ["Al", 26.98154], ["Si", 28.0855], ["P", 30.97376], ["S", 32.06], ["Cl", 35.453],
["Ar", 39.948], ["K", 39.0983], ["Ca", 40.08], ["Sc", 44.9559], ["Ti", 47.90], ["V", 50.9415], ["Cr", 51.996], ["Mn", 54.9380], ["Fe", 55.847], ["Ni", 58.70],
["Co", 58.9332], ["Cu", 63.546], ["Zn", 65.38], ["Ga", 69.72], ["Ge", 72.59], ["As", 74.9216], ["Se", 78.96], ["Br", 79.904], ["Kr", 83.80], ["Rb", 85.4678],
["Sr", 87.62], ["Y", 88.9059], ["Zr", 91.22], ["Nb", 92.9064], ["Mo", 95.94], ["Tc", 98], ["Ru", 101.07], ["Rh", 102.9055], ["Pd", 106.4], ["Ag", 107.868],
["Cd", 112.41], ["In", 114.82], ["Sn", 118.69], ["Sb", 121.75], ["I", 126.9045], ["Te", 127.60], ["Xe", 131.30], ["Cs", 132.9054], ["Ba", 137.33],
["La", 138.9055], ["Ce", 140.12], ["Pr", 140.9077], ["Nd", 144.24], ["Pm", 145], ["Sm", 150.4], ["Eu", 151.96], ["Gd", 157.25], ["Tb", 158.9254],
["Dy", 162.50], ["Ho", 164.9304], ["Er", 167.26], ["Tm", 168.9342], ["Yb", 173.04], ["Lu", 174.967], ["Hf", 178.49], ["Ta", 180.9479], ["W", 183.85],
["Re", 186.207], ["Os", 190.2], ["Ir", 192.22], ["Pt", 195.09], ["Au", 196.9665], ["Hg", 200.59], ["Tl", 204.37], ["Pb", 207.2], ["Bi", 208.9804],
["Po", 209], ["At", 210], ["Rn", 222], ["Fr", 223], ["Ra", 226.0254], ["Ac", 227.0278], ["Pa", 231.0359], ["Th", 232.0381], ["Np", 237.0482],
["U", 238.029], ["Pu", 242], ["Am", 243], ["Bk", 247], ["Cm", 247], ["Cf", 251], ["Es", 252], ["Mt", 278], ["Fm", 257], ["Md", 258],
["No", 259], ["Lr", 266], ["Rf", 267], ["Db", 268], ["Sg", 269], ["Bh", 270], ["Hs", 269], ["Ds", 281], ["Rg", 282], ["Cn", 285], ["Nh", 286], ["Fl", 289],
["Mc", 290], ["Lv", 293], ["Ts", 294], ["Og", 294]]);
//Regex patterns for chemical formulae
const atomPattern = /[A-Z][a-z]{0,2}\d*/g;
const bracketPattern = /\(.*?\)\d/g;

//Export function
exports.molarMass = function (formula) {
    try {
        if (formula != "") {
            var inBrackets = formula.match(bracketPattern);
            var compound = formula.replace(bracketPattern, "");
            var bracketsFormatted = inBrackets != null ? bracketFormat(inBrackets) : null;
            var atoms = compound.match(atomPattern).concat(bracketsFormatted);
            //Remove potential blank elements from array
            atoms = atoms.filter(function (i) {
                return i != null;
            });
            //"atoms" is a string array containing a chemical symbol (H, Na, etc.), and potentially an integer
            var totalMass = 0;
            for (var i = 0; i < atoms.length; i++) {
                totalMass += atomMass(atoms[i]);
            }
            return totalMass.toFixed(2) + " g/mol";
        } else {
            return "To use this command, enter a chemical compound! Remember that molecular formulas are case sensitive!!";
        }
    } catch (error) {
        return "Couldn't complete operation. Are you sure that's a valid chemical formula?";
    }
}


//Local functions
//Multiply the compounds inside any brackets by their respective amounts
function bracketFormat(inBrackets) {
    var atoms = [];
    for (var i = 0; i < inBrackets.length; i++) {
        //Find out what to multiply all things by
        var multipleUnformatted = inBrackets[i].match(/\)+?\d/i);
        var multiple = parseInt(multipleUnformatted[0].slice(1));
        //Get the individual atoms
        var atomsTemp = inBrackets[i].match(atomPattern);
        //Handle the situation that the atom is already being multiplied by something (i.e. the H4 in NH4)
        for (var j = 0; j < atomsTemp.length; j++) {
            var endNumUnformatted = atomsTemp[j].match(/\d/);
            var endNum = (endNumUnformatted != null ? parseInt(endNumUnformatted[0]) : 1);
            atomsTemp[j] = atomsTemp[j].match(/[a-zA-z]/) + parseInt(multiple * endNum);
            atoms.push(atomsTemp[j]);
        }
    }
    return atoms;
}

//Calculate the mass of atoms
//Pre: a string is passed consisting of 1-3 letters and any amount of numbers; Post: an integer is returned
function atomMass(atom) {
    var key = atom.match(/[a-zA-Z]*/);
    var temp = atom.match(/\d+/);
    var n = (temp != null ? parseInt(temp[0]) : 1);
    return parseFloat(atomicMasses.get(key[0]) * parseInt(n));
}
