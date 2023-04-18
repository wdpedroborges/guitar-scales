import { useState, useRef, useEffect } from 'react'
import './App.css'

const OPEN_NOTES = ['E','A','D','G','B','E']
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const LOW_TO_HIGH = ['C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5', 'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6']

const inList = (value: any, list: any[]) => {
	for (let i = 0; i < list.length; i++) {
		if (value === list[i])
			return true
	}

	return false
}

const defineTheRightOctave = (listOfNotes: string[], octave = 3) => {
	let initialIndex = 0
	LOW_TO_HIGH.forEach((note, index) => {
		if (note === `${listOfNotes[0]}${octave}`) {
			initialIndex = index
		}
	})

	let result = [], iter = 0, maxIter = listOfNotes.length
	for (let i = initialIndex; i < (initialIndex + listOfNotes.length); i++) {
		for (let j = 0; j < listOfNotes.length; j++) {
			// se for uma note normal, sem acidente, o search a encontrará mesmo em uma note com acidente, então é preciso usar um if diferente para cada note, caso ela seja sustenida ou não
			let isSharp = listOfNotes[j].search('#') !== -1 ? true : false

			if (!isSharp) {
				if (LOW_TO_HIGH[i].search(listOfNotes[j]) !== -1 && LOW_TO_HIGH[i].search('#') === -1 && !inList(LOW_TO_HIGH[i], result))
					result.push(LOW_TO_HIGH[i])       
			} else {
				if (LOW_TO_HIGH[i].search(listOfNotes[j]) !== -1 && !inList(LOW_TO_HIGH[i], result))
					result.push(LOW_TO_HIGH[i])
			}
		}

		if (iter >= maxIter)
			break
		iter++
	}

	return result
}

const allNotesStartingFromOne = (note: string, amount: number, octave = 3) => {
	let index = 0
	for (let i = 0; i < NOTES.length; i++) {
		if (NOTES[i] === note) {
			index = i
			break
		}
	}

	let allNotes = [], currentAmount = 0
	while(currentAmount < amount) {
		allNotes.push(NOTES[index])

		if (index < NOTES.length - 1) {
			index++
		} else {
			index = 0
		}

		currentAmount++
	}

	return defineTheRightOctave(allNotes, octave)
}

type StringArray = string[]

const createGuitar = (openNotes: string[], amount = 13): StringArray[] => {
	let guitar = []
	for (let i = 0; i < openNotes.length; i++) {
		let currentOctave = 3

		switch(i) {
			case 0: // mizona
				currentOctave = 3
				break;
			case 1: // lá
				currentOctave = 3
				break;
			case 2: // ré
				currentOctave = 4
				break;
			case 3: // sol
				currentOctave = 4
				break;
			case 4: // si
				currentOctave = 4
				break;
			case 5: // mizinha
				currentOctave = 5
				break;
			default:
				currentOctave = 5
		}

		guitar.unshift(allNotesStartingFromOne(openNotes[i], amount, currentOctave))
	}

	return guitar
}

const checkNote = (note: string) => {
	switch(note) {
		case 'Cb':
			return 'B'
			break;
		case 'Db':
			return 'C#'
			break;
		case 'Eb':
			return 'D#'
			break;
		case 'Fb':
			return 'E'
			break;
		case 'Gb':
			return 'F#'
			break;
		case 'Ab':
			return 'G#'
			break;
		case 'Bb':
			return 'A#'
			break;
		case 'Cbb':
			return 'A#'
			break;
		case 'Dbb':
			return 'C'
			break;
		case 'Ebb':
			return 'D'
			break;
		case 'Fbb':
			return 'D#'
			break;
		case 'Gbb':
			return 'F'
			break;
		case 'Abb':
			return 'G'
			break;
		case 'Bbb':
			return 'A'
			break;
		case 'C##':
			return 'D'
			break;
		case 'D##':
			return 'E'
			break;
		case 'E#':
			return 'F'
			break;
		case 'F##':
			return 'G'
			break;
		case 'G##':
			return 'A'
			break;
		case 'A##':
			return 'B'
			break;
		case 'B#':
			return 'C'
			break;
		default:
			return note 
	}
}

function noteGivenInterval(note: string, interval: string): string {
	return intervalWithAccidents(note, interval).toString();
}

function intervalGivenNotes(baseNote: string, relativeNote: string) {
	const INDEX_INTERVALS = [
		'1', '2m', '2M', '2A', '3m', '3M', '4J', '4A', '5-', '5J', '5A', '6m', '6M', '7-', '7m', '7M'
	];
	for (let i = 0; i < INDEX_INTERVALS.length; i++) {
		if (noteGivenInterval(baseNote, INDEX_INTERVALS[i]) === relativeNote) {
			return INDEX_INTERVALS[i];
		}
	}
}

// encontrar o intervalo sem acidente de uma note qualquer é fácil, pois basta contar; se quero a terça de C, basta contar 3 a partir de C
// e esse é o primeiro passo para resolver o problema; uma vez que sabemos o interval sem o acidente, basta inserir o acidente; é aí que entra o modelo
// se o acidente é 2m, por exemplo, isso significa que daremos apenas um passo a partir da note base, chegando numa note que seja a segunda, isso porque o interval de 2m é o menor interval de segunda possível, neste caso; portanto, basta buscar a posição da note base no modelo e, a partir dela, andar um passo, para buscar aquela note com acidente que, sem o acidente, é igual ao interval sem acidente que buscamos anteriormente
function intervalWithAccidents(note: string, interval: string) {
	let modelo = ['C/Dbb/B#/A###', 'C#/Db/Ebbb/B##', 'D/Ebb/C##/Fbbb/B###', 'D#/Eb/Fbb/C###', 'E/Fb/D##/Gbbb', 'F/Gbb/E#/D###', 'F#/Gb/Abbb/E##', 'G/Abb/F##/E###', 'G#/Ab/Bbbb/F###', 'A/Bbb/G##/Cbbb', 'A#/Bb/Cbb/G###', 'B/A##/Cb/Dbbb'];

	// multiplicar o modelo é importante para quando se deseja buscar um interval distante, tipo 7M, para uma note como B ou mesmo B#, pois assim o loop apenas continua indo, em vez de precisar voltar
	modelo = multiplyArray(modelo, 2);

	function getPositionBaseNote(note: string): number {
		for (let i = 0; i < modelo.length; i++) {
			let tmp = modelo[i].split('/');
			for (let j = 0; j < tmp.length; j++) {
				if (note === tmp[j]) return i;
			}
		}

		return -1
	}

	function generateResult(setOfPossibleNotes: string[], baseNoteInterval: string): string {
		for (let i = 0; i < setOfPossibleNotes.length; i++) {
			if (isInString(setOfPossibleNotes[i], baseNoteInterval)) {
				return setOfPossibleNotes[i];
			}
		}

		return ''
	}

	let result = '', baseNoteInterval = '', positionBaseNote, setOfPossibleNotes;

	if (note && interval) {
		switch(interval) {
			case '2m':
				// 1 passo
				baseNoteInterval = intervalWithoutAccident(note, 2);
				positionBaseNote = getPositionBaseNote(note);
				setOfPossibleNotes = modelo[positionBaseNote + 1].split('/');
				result = generateResult(setOfPossibleNotes, baseNoteInterval);  
				break;
			case '2M':
				// 2 passos
				baseNoteInterval = intervalWithoutAccident(note, 2);
				positionBaseNote = getPositionBaseNote(note);
				setOfPossibleNotes = modelo[positionBaseNote + 2].split('/');
				result = generateResult(setOfPossibleNotes, baseNoteInterval);
				break;
			case '2A':
				// 3 passos
				baseNoteInterval = intervalWithoutAccident(note, 2);
				positionBaseNote = getPositionBaseNote(note);
				setOfPossibleNotes = modelo[positionBaseNote + 3].split('/');
				result = generateResult(setOfPossibleNotes, baseNoteInterval);
				break;
			case '3m':
				// 3 passos
				baseNoteInterval = intervalWithoutAccident(note, 3);
				positionBaseNote = getPositionBaseNote(note);
				setOfPossibleNotes = modelo[positionBaseNote + 3].split('/');
				result = generateResult(setOfPossibleNotes, baseNoteInterval);
				break;
			case '3M':
				// 4 passos
				baseNoteInterval = intervalWithoutAccident(note, 3);
				positionBaseNote = getPositionBaseNote(note);
				setOfPossibleNotes = modelo[positionBaseNote + 4].split('/');
				result = generateResult(setOfPossibleNotes, baseNoteInterval);
				break;
			case '4J':
				// 5 passos
				baseNoteInterval = intervalWithoutAccident(note, 4);
				positionBaseNote = getPositionBaseNote(note);
				setOfPossibleNotes = modelo[positionBaseNote + 5].split('/');
				result = generateResult(setOfPossibleNotes, baseNoteInterval);
				break;
			case '4A':
				// 6 passos
				baseNoteInterval = intervalWithoutAccident(note, 4);
				positionBaseNote = getPositionBaseNote(note);
				setOfPossibleNotes = modelo[positionBaseNote + 6].split('/');
				result = generateResult(setOfPossibleNotes, baseNoteInterval);
				break;
			case '5-':
				// 6 passos
				baseNoteInterval = intervalWithoutAccident(note, 5);
				positionBaseNote = getPositionBaseNote(note);
				setOfPossibleNotes = modelo[positionBaseNote + 6].split('/');
				result = generateResult(setOfPossibleNotes, baseNoteInterval);
				break;
			case '5J':
				// 7 passos
				baseNoteInterval = intervalWithoutAccident(note, 5);
				positionBaseNote = getPositionBaseNote(note);
				setOfPossibleNotes = modelo[positionBaseNote + 7].split('/');
				result = generateResult(setOfPossibleNotes, baseNoteInterval);
				break;
			case '5A':
				// 8 passos
				baseNoteInterval = intervalWithoutAccident(note, 5);
				positionBaseNote = getPositionBaseNote(note);
				setOfPossibleNotes = modelo[positionBaseNote + 8].split('/');
				result = generateResult(setOfPossibleNotes, baseNoteInterval);
				break;
			case '6m':
				// 8 passos
				baseNoteInterval = intervalWithoutAccident(note, 6);
				positionBaseNote = getPositionBaseNote(note);
				setOfPossibleNotes = modelo[positionBaseNote + 8].split('/');
				result = generateResult(setOfPossibleNotes, baseNoteInterval);
				break;
			case '6M':
				// 9 passos
				baseNoteInterval = intervalWithoutAccident(note, 6);
				positionBaseNote = getPositionBaseNote(note);
				setOfPossibleNotes = modelo[positionBaseNote + 9].split('/');
				result = generateResult(setOfPossibleNotes, baseNoteInterval);
				break;
			case '7-':
				// 9 passos
				baseNoteInterval = intervalWithoutAccident(note, 7);
				positionBaseNote = getPositionBaseNote(note);
				setOfPossibleNotes = modelo[positionBaseNote + 9].split('/');
				result = generateResult(setOfPossibleNotes, baseNoteInterval);
				break;
			case '7m':
				// 10 passos
				baseNoteInterval = intervalWithoutAccident(note, 7);
				positionBaseNote = getPositionBaseNote(note);
				setOfPossibleNotes = modelo[positionBaseNote + 10].split('/');
				result = generateResult(setOfPossibleNotes, baseNoteInterval);
				break;
			case '7M':
				// 11 passos
				baseNoteInterval = intervalWithoutAccident(note, 7);
				positionBaseNote = getPositionBaseNote(note);
				setOfPossibleNotes = modelo[positionBaseNote + 11].split('/');
				result = generateResult(setOfPossibleNotes, baseNoteInterval);
		}
	}

	return result;
}

function intervalWithoutAccident(note: string, interval: number): string {
	if (note) {
		note = note.replaceAll('#', '');
		note = note.replaceAll('##', '');
		note = note.replaceAll('###', '');
		note = note.replaceAll('b', '');
		note = note.replaceAll('bb', '');
		note = note.replaceAll('bbb', '');

		let scale = multiplyArray(['C', 'D', 'E', 'F', 'G', 'A', 'B'], 3);
		let positionBaseNote = 0;
		for (let i = 0; i < scale.length; i++) {
			if (note === scale[i]) {
				positionBaseNote = i;
				break;
			}
		}
		return scale[positionBaseNote + interval - 1];
	}

	return '';
}

function isInString(string: string, value: string): boolean {
	let splittedString = string.split('');
	for (let i = 0; i < splittedString.length; i++) {
		if (value === splittedString[i]) {
			return true;
		}
	}

	return false;
}

function multiplyArray(array: any[], times: number): any[] {
	let newArray = [];
	for (let i = 0; i < times; i++) {
		for (let j = 0; j < array.length; j++) {
			newArray.push(array[j]);
		}
	}

	return newArray;
}

function App() {
	const [scale, setScale] = useState<string[]>([])

	useEffect(() => {
		const audioFiles = LOW_TO_HIGH.map((note) => {
			return `notes/${note}.mid.mp3`
		})

		audioFiles.forEach((file) => {
		  const audio = new Audio(file);
		  audio.load();
		})
	}, [])

	const createScale = (key: string, pattern: string[]) => {
		let newScale = [key]
		for (let i = 0; i < pattern.length; i++) {
			newScale.push(noteGivenInterval(key, pattern[i]))
		}

		for (let i = 0; i < newScale.length; i++) {
			newScale[i] = checkNote(newScale[i])
		}

		setScale(newScale)
	}

	return (
		<div className="App">
			<h1>Guitar Scales</h1>
			<Guitar scale={scale}/>
			<UserInputs createScale={createScale}/>
		</div>
	)
}

type GuitarProps = {
	scale: string[]
}

function Guitar({scale}: GuitarProps) {
	const [update, setUpdate] = useState(0)

	let guitar = createGuitar(OPEN_NOTES)

	const playNote = (note: string) => {
			const sound = new Audio(`/notes/${note}.mid.mp3`);
			sound.play();
	}

	const removeNumbers = (note: string): string => {
		note = note.replace('2', '')
		note = note.replace('3', '')
		note = note.replace('4', '')
		note = note.replace('5', '')
		note = note.replace('6', '')

		return note
	}

	const bringItsEqual = (note: string): string => {
		switch(note) {
			case 'C#':
				return `${note}/Db`
				break
			case 'D#':
				return `${note}/Eb`
				break
			case 'F#':
				return `${note}/Gb`
				break
			case 'G#':
				return `${note}/Ab`
				break
			case 'A#':
				return `${note}/Bb`
				break
			default:
				return note
		}
	}

	const mustPaint = (note: string): boolean => {
		if (!scale) return false

		note = removeNumbers(note)

		for (let i = 0; i < scale.length; i++) {
			if (note === scale[i])
				return true
		}

		return false
	}

	let key = scale[0]

	const getRightClassNameForNote = (note: string): string => {
		if (note === scale[0]) {
			return 'first'
		} else if (note === scale[2]) {
			return 'third'
		} else if (note === scale[4]) {
			return 'fifth'
		}

		return 'markedNote'
	}

	return (
		<div className="strings">
			{guitar.map((string, index) => {
				return <div key={index} className="notes">{string.map((note, subIndex) => {
					if (mustPaint(note)) {
						return <div key={subIndex} className={getRightClassNameForNote(removeNumbers(note))} onClick={() => playNote(`${note.replaceAll('#', 'sharp')}`)}>{bringItsEqual(removeNumbers(note))}</div>
					} else {
						if (subIndex === 0) {
							return <div key={subIndex} className="open" onClick={() => playNote(`${note.replaceAll('#', 'sharp')}`)}>{bringItsEqual(removeNumbers(note))}</div>
						} else {
							return <div key={subIndex} onClick={() => playNote(`${note.replaceAll('#', 'sharp')}`)}>{bringItsEqual(removeNumbers(note))}</div>
						}           
					}
				})}</div>
			})}
		</div>
	)
}

type UserInputsProps = {
	createScale: (key: string, pattern: string[]) => void
}

function UserInputs({createScale}: UserInputsProps) {
	const selectKey = useRef<HTMLSelectElement>(null)
	const selectScale = useRef<HTMLSelectElement>(null)

	const handleCalculation = () => {
		createScale(selectKey.current!.value, (selectScale.current!.value).split(' '))
	}

	return (
		<div className="userInputs">
			<label htmlFor="selectKey">Key:</label>
			<select ref={selectKey} id="selectKey">
				<option value="C">C</option>
				<option value="D">D</option>
				<option value="E">E</option>
				<option value="F">F</option>
				<option value="G">G</option>
				<option value="A">A</option>
				<option value="B">B</option>
			</select>
			<label htmlFor="selectScales">scale:</label>
			<select ref={selectScale} id="selectScales">
				<optgroup label="Diatonic">
					<option value="2M 3M 4J 5J 6M 7M">Natural major</option>
					<option value="2M 3m 4J 5J 6m 7m">Natural minor</option>
					<option value="2M 3m 4J 5J 6m 7M">Harmonic minor</option>
					<option value="2M 3m 4J 5J 6M 7M">Melodic minor</option>
				</optgroup>
				<optgroup label="Pentatonic">
					<option value="2M 3M 5J 6M">Major</option>
					<option value="3m 4J 5J 7m">Minor</option>
				</optgroup>
				<optgroup label="Blues">
					<option value="2M 2A 3M 5J 6M">Major</option>
					<option value="3m 4J 4A 5J 7m">Minor</option>
				</optgroup>
				<optgroup label="Greek Modes">
					<option value="2M 3M 4J 5J 6M 7M">Ionian</option>
					<option value="2M 3m 4J 5J 6M 7m">Dorian</option>
					<option value="2m 3m 4J 5J 6M 7m">Phrygian</option>
					<option value="2M 3M 4A 5J 6M 7M">Lydian</option>
					<option value="2M 3M 4J 5J 6M 7m">Mixolydian</option>
					<option value="2M 3m 4J 5J 6m 7m">Aeolian</option>
					<option value="2m 3m 4J 5- 6m 7m">Locrian</option>
				</optgroup>
				<optgroup label="Neapolitan">
					<option value="2m 3m 4J 5J 6M 7M">Neapolitan major</option>
					<option value="2m 3m 4J 5J 6m 7M">Neapolitan minor</option>
				</optgroup>
				<optgroup label="Japanese scales">
					<option value="2M 3m 5J 6m">Sakura</option>
					<option value="2M 3m 5J 6M">Akebono</option>
					<option value="2m 4J 5- 7m">Iwato</option>
					<option value="2m 4J 5- 6m">In</option>
					<option value="2M 3m 3M 5J 6M 7m">Banshikicho</option>
				</optgroup>
				<optgroup label="Exotic scales">
					<option value="2M 3M 4J 5J 6m 7m">Indian</option>
					<option value="2M 3m 4J 4A 5A 6M 7M">Arabic</option>
					<option value="2m 3M 4J 5- 6m 7M">Persian</option>
					<option value="2M 3m 4A 5J 6m 7M">Hungarian (Gypsy)</option>
					<option value="2M 3m 4A 5J 6M 7m">Ukrainian</option>
				</optgroup>
			</select>

			<button onClick={() => handleCalculation()}>Show notes</button>
		</div>
	)
}

export default App
