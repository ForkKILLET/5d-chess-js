const boardFuncs = require('@local/board');
const pgnFuncs = require('@local/pgn');
const pieceFuncs = require('@local/piece');

exports.toPosition = (positionObj) => {
  var res = [];
  if(positionObj.timeline >= 0) {
    res[0] = (positionObj.timeline*2);
  }
  else if(positionObj.timeline < 0) {
    res[0] = ((-positionObj.timeline)*2) - 1;
  }
  res[1] = ((positionObj.turn - 1) * 2) + (positionObj.player === 'white' ? 0 : 1);
  var coord = pgnFuncs.fromSanCoord(positionObj.coordinate);
  res[2] = coord[0];
  res[3] = coord[1];
  return res;
}

exports.fromPosition = (position) => {
  var res = {};
  if(position[0] === 0) {
    res.timeline = 0;
  }
  else if(position[0] % 2 === 0) {
    res.timeline = Math.ceil(position[0]/2);
  }
  else {
    res.timeline = -Math.ceil(position[0]/2);
  }
  res.turn = Math.floor(position[1]/2) + 1;
  res.player = (position[1] % 2 === 0 ? 'white' : 'black');
  res.coordinate = pgnFuncs.toSanCoord([position[2], position[3]]);
  res.rank = position[2] + 1;
  res.file = position[3] + 1;
  return res;
}

exports.toMove = (moveObj) => {
  var res = [];
  res[0] = this.toPosition(moveObj.start);
  res[1] = this.toPosition(moveObj.end);
  if(moveObj.promotion !== null) {
    if(moveObj.promotion === 'B') {
      res[1][4] = 3 + (moveObj.player === 'white' ? 1 : 0);
    }
    else if(moveObj.promotion === 'N') {
      res[1][4] = 5 + (moveObj.player === 'white' ? 1 : 0);
    }
    else if(moveObj.promotion === 'R') {
      res[1][4] = 7 + (moveObj.player === 'white' ? 1 : 0);
    }
    else if(moveObj.promotion === 'Q') {
      res[1][4] = 9 + (moveObj.player === 'white' ? 1 : 0);
    }
    else if(moveObj.promotion === 'K') {
      res[1][4] = 11 + (moveObj.player === 'white' ? 1 : 0);
    }
  }
  if(moveObj.enPassant !== null) {
    res[2] = this.toPosition(moveObj.enPassant);
  }
  if(moveObj.castling !== null) {
    res[2] = this.toPosition(moveObj.castling.start);
    res[3] = this.toPosition(moveObj.castling.end);
  }
  return res;
}

exports.fromMove = (move) => {
  var res = {
    promotion: null,
    enPassant: null,
    castling: null
  };
  res.start = this.fromPosition(move[0]);
  res.end = this.fromPosition(move[1]);
  res.player = (move[0][1] % 2 === 0 ? 'white' : 'black');
  if(move[1][4] !== undefined && move.length === 2) {
    res.promotion = pieceFuncs.toChar(move[1][4]);
  }
  if(move.length === 3) {
    res.enPassant = this.fromPosition(move[2]);
  }
  if(move.length === 4) {
    res.castling = {
      start: this.fromPosition(move[2]),
      end: this.fromPosition(move[3])
    }
  }
  return res;
}

exports.toAction = (actionObj) => {
  var res = [];
  for(var i = 0;i < actionObj.moves.length;i++) {
    res.push(this.toMove(actionObj.moves[i]));
  }
  return res;
}

exports.fromAction = (actionNum, moves) => {
  var res = {};
  res.action = Math.floor(actionNum/2) + 1;
  res.player = (actionNum % 2 === 0 ? 'white' : 'black');
  res.moves = [];
  for(var i = 0;i < moves.length;i++) {
    res.moves.push(this.fromMove(moves[i]));
  }
  return res;
}

exports.toPiece = (pieceObj) => {
  var res = 1 + (pieceObj.player === 'white' ? 1 : 0);
  if(pieceObj.piece === 'B') {
    res = 3 + (pieceObj.player === 'white' ? 1 : 0);
  }
  else if(pieceObj.piece === 'N') {
    res = 5 + (pieceObj.player === 'white' ? 1 : 0);
  }
  else if(pieceObj.piece === 'R') {
    res = 7 + (pieceObj.player === 'white' ? 1 : 0);
  }
  else if(pieceObj.piece === 'Q') {
    res = 9 + (pieceObj.player === 'white' ? 1 : 0);
  }
  else if(pieceObj.piece === 'K') {
    res = 11 + (pieceObj.player === 'white' ? 1 : 0);
  }
  if(pieceObj.hasMoved === false) {
    res = -res;
  }
  return res;
}

exports.fromPiece = (board, pos) => {
  var res = {};
  var piece = board[pos[0]][pos[1]][pos[2]][pos[3]];
  res.position = this.fromPosition(pos);
  res.piece = pieceFuncs.toChar(piece);
  res.player = (Math.abs(piece) % 2 === 0 ? 'white' : 'black');
  res.hasMoved = piece > 0;
  return res;
}

exports.toTurn = (turnObj) => {
  var res = [];
  for(var r = 0;r < turnObj.height;r++) {
    res.push([]);
    for(var f = 0;f < turnObj.width;f++) {
      res[r][f] = 0;
    }
  }
  for(var i = 0;i < turnObj.pieces.length;i++) {
    var piece = this.toPiece(turnObj.pieces[i]);
    var position = this.toPosition(turnObj.pieces[i].position);
    res[position[2]][position[3]] = piece;
  }
  return res;
}

exports.fromTurn = (board, timeline, turn) => {
  var res = {};
  res.turn = Math.floor(turn/2) + 1;
  res.player = (turn % 2 === 0 ? 'white' : 'black');
  res.pieces = [];
  res.width = 0;
  var currTurn = board[timeline][turn];
  res.height = currTurn.length;
  for(var r = 0;r < currTurn.length;r++) {
    for(var f = 0;f < currTurn[r].length;f++) {
      if(currTurn[r][f] !== 0) {
        res.pieces.push(this.fromPiece(board,[
          timeline,
          turn,
          r,
          f
        ]));
      }
      if(res.width < currTurn[r].length) {
        res.width = currTurn[r].length;
      }
    }
  }
  return res;
}

exports.toTimeline = (timelineObj) => {
  var res = [];
  var maxTurnNumber = 0;
  for(var i = 0;i < timelineObj.turns.length;i++) {
    var newTurnNumber = ((timelineObj.turns[i].turn - 1) * 2) + (timelineObj.turns[i].player === 'white' ? 0 : 1);
    if(maxTurnNumber < newTurnNumber) {
      maxTurnNumber = newTurnNumber;
    }
  }
  for(var i = 0;i < maxTurnNumber;i++) {
    res[i] = null;
  }
  for(var i = 0;i < timelineObj.turns.length;i++) {
    var newTurnNumber = ((timelineObj.turns[i].turn - 1) * 2) + (timelineObj.turns[i].player === 'white' ? 0 : 1);
    res[newTurnNumber] = this.toTurn(timelineObj.turns[i]);
  }
  return res;
}

exports.fromTimeline = (board, actionNum, timeline) => {
  var res = {};
  if(timeline === 0) {
    res.timeline = 0;
  }
  else if(timeline % 2 === 0) {
    res.timeline = Math.ceil(timeline/2);
  }
  else {
    res.timeline = -Math.ceil(timeline/2);
  }
  res.player = (timeline % 2 === 0 ? 'white' : 'black');
  res.turns = [];
  res.active = boardFuncs.active(board).includes(timeline);
  res.present = boardFuncs.present(board, actionNum).includes(timeline);
  var currTimeline = board[timeline];
  for(var i = 0;i < currTimeline.length;i++) {
    if(!(typeof currTimeline[i] === 'undefined' || currTimeline[i] === null)) {
      res.turns.push(this.fromTurn(board, timeline, i));
    }
  }
  return res;
}

exports.toBoard = (boardObj) => {
  var res = [];
  var maxTimelineNumber = 0;
  for(var i = 0;i < boardObj.timelines.length;i++) {
    var newTimelineNumber = (boardObj.timelines[i].timeline*2);
    if(boardObj.timelines[i].timeline < 0) {
      newTimelineNumber = ((-boardObj.timelines[i].timeline.timeline)*2) - 1;
    }
    if(maxTimelineNumber < newTimelineNumber) {
      maxTimelineNumber = newTimelineNumber;
    }
  }
  for(var i = 0;i < maxTimelineNumber;i++) {
    res[i] = null;
  }
  for(var i = 0;i < boardObj.timelines.length;i++) {
    var newTimelineNumber = (boardObj.timelines[i].timeline*2);
    if(boardObj.timelines[i].timeline < 0) {
      newTimelineNumber = ((-boardObj.timelines[i].timeline.timeline)*2) - 1;
    }
    res[newTimelineNumber] = this.toTimeline(boardObj.timelines[i]);
  }
  return res;
}

exports.fromBoard = (board, actionNum) => {
  var res = {};
  res.action = Math.floor(actionNum/2) + 1;
  res.player = (actionNum % 2 === 0 ? 'white' : 'black');
  res.timelines = [];
  for(var i = 0;i < board.length;i++) {
    if(!(typeof board[i] === 'undefined' || board[i] === null)) {
      res.timelines.push(this.fromTimeline(board, actionNum, i));
    }
  }
  res.width = 0;
  res.height = 0;
  for(var l = 0;l < res.timelines.length;l++) {
    for(var t = 0;t < res.timelines[l].turns.length;t++) {
      if(res.width < res.timelines[l].turns[t].width) {
        res.width = res.timelines[l].turns[t].width;
      }
      if(res.height < res.timelines[l].turns[t].height) {
        res.height = res.timelines[l].turns[t].height;
      }
    }
  }
  return res;
}
