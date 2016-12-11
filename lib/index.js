const characters = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U',
  'V', 'W', 'X', 'Y', 'Z',
  'a', 'b', 'c', 'd', 'e', 'f', 'g',
  'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't', 'u',
  'v', 'w', 'x', 'y', 'z', '0', '1',
  '2', '3', '4', '5', '6', '7', '8',
  '9', '!', '@', '+', '$', '%', '^',
  '&', '*', '(', ')', '-', '_', '~',
  '`', ':', ';', '<', '>', ',', '.',
  '/', '?', "'", '{', '}', '[', '\\',
  ']', '|'
]

class Parser {
  constructor (str) {
    this.data = str
    this.symbol = null
    this.cursor = -1
  }

  // Moves the cursor the next symbol in the list
  Next () {
    this.cursor++
    if (this.cursor >= this.data.length) {
      this.symbol = null
      return false
    }
    this.symbol = this.data[this.cursor]
    return true
  }

  // Moves the cursor the next symbol in the list
  Back () {
    this.cursor--
    if (this.cursor < 0) {
      this.symbol = null
      return false
    }
    this.symbol = this.data[this.cursor]
    return true
  }

  // Allows for peeking at the next symbol
  Peek () {
    if (this.cursor + 1 < this.data.length) {
      return this.data[this.cursor + 1]
    }
    return null
  }

  // Look back at the last character
  LookBack () {
    if (this.cursor - 1 >= 0) {
      return this.data[this.cursor - 1]
    }
    return null
  }

  // Determines whether the current sybmol is equal to the passed in symbol
  Term (symbol) {
    return this.symbol === symbol
  }

  // Basic Grammar types
  // Character for starting a comment
  CommentCharacter () {
    return this.Term('#')
  }

  // The whitespace character
  WhiteSpace () {
    return this.Term(' ')
  }

  // Character that signals the file is finished
  FileTerminator () {
    return this.Term(null)
  }

  // Character that signals the end of the current reading session
  Terminator () {
    return this.Term('\n') || this.FileTerminator()
  }

  // Returns whether the current symbole is considered a valid character
  Character () {
    return ~characters.indexOf(this.symbol)
  }

  // Complex Grammar types

  // Is this set of symbols an Identifier
  Identifier () {
    let count = 0
    while (this.Character()) {
      count++
      this.Next()
    }

    return count !== 0
  }

  // Is this set of symbols a value set
  Value () {
    let oldCursor = this.cursor
    let count = 0
    while (this.Character() || this.WhiteSpace()) {
      count++
      this.Next()
    }

    while (this.LookBack() === ' ') {
      count--
      this.Back()
    }

    if (count > 0) {
      return true
    }
    this.cursor = oldCursor
    return false
  }

  // Is this a quoted value set
  QuotedValue () {
    let oldCursor = this.cursor
    let count = 0
    if (this.Term('"')) {
      this.Next()
      while (this.Value() || this.Term('#') || this.Term('"') || this.WhiteSpace()) {
        count++
        this.Next()
      }
      this.Next()
      if ((this.Term('"') || this.LookBack() === '"') &&
        count > 0) {
        return true
      }
    }
    this.cursor = oldCursor
    return false
  }

  // Are we looking at an assignment operation
  Assignment () {
    let oldCursor = this.cursor
    if (this.Identifier()) {
      this.Next()
      if (this.Term('=') || this.WhiteSpace()) {
        this.Next()
        if (this.Value() || this.QuotedValue()) {
          return true
        }
      }
    }

    // We failed to identify an assignment so reset the cursor
    this.cursor = oldCursor
    return false
  }

  // Is the next set of characters a comment
  Comment () {
    let oldCursor = this.cursor
    if (this.CommentCharacter()) {
      while (!this.Terminator()) {
        this.Next()
      }
      return true
    }
    this.cursor = oldCursor
    return false
  }

  // Is this next set of characters a statement
  Statement () {
    let oldCursor = this.cursor
    if (this.Assignment()) {
      this.Next()
      while (this.WhiteSpace()) {
        this.Next()
      }
      if (this.Comment() || this.Terminator()) {
        return true
      }
    }

    this.cursor = oldCursor
    return false
  }
}

module.exports = {
  Parser
}
