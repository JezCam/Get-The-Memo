"use client";

import Piece, { PieceHandle } from "./components/piece";
import { useRef, useState } from "react";

export default function Home() {
  const [state, setState] = useState<string>("submitting");
  const [streak, setStreak] = useState<number>(0);
  const [redo, setRedo] = useState<boolean>(false);

  // true = corner, false = edge
  const [pieceType, setPieceType] = useState<string>("corner");
  const [allowedPieceTypes, setAllowedPieceTypes] = useState<string>("any");
  const [seed, setSeed] = useState<number>(0);

  const pieceRef = useRef<PieceHandle>(null);

  const handleSubmit = (success: boolean) => {
    if (success) {
      setState("correct");
      if (redo) {
        setRedo(false);
      } else {
        setStreak(streak + 1);
      }
    } else {
      setState("incorrect");
      setStreak(0);
    }
  };

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  const nextPiece = (newAllowedPieceTypes?: string) => {
    if (!newAllowedPieceTypes) newAllowedPieceTypes = allowedPieceTypes;

    let newPieceType = pieceType;
    let newSeed = seed;
    let seedMax = 12;

    if (newAllowedPieceTypes == "any") {
      getRandomInt(2) == 0
        ? (newPieceType = "corner")
        : (newPieceType = "edge");
      setPieceType(newPieceType);
    } else if (newAllowedPieceTypes == "corners") {
      newPieceType = "corner";
      setPieceType(newPieceType);
    } else {
      newPieceType = "edge";
      setPieceType(newPieceType);
    }

    if (newPieceType == "corner") {
      seedMax = 8;
    }

    while (newSeed == seed) {
      newSeed = getRandomInt(seedMax);
    }

    setSeed(newSeed);
  };

  return (
    <main className="flex min-h-screen flex-col gap-10 items-center p-24">
      <h1 className="text-[2rem] font-semibold text-white text-center">
        Get The Memo
      </h1>
      <div className="flex flex-col gap-2 items-center text-white">
        <div className="flex gap-2">
          <label>corners</label>
          <input
            onChange={(e) => {
              if (e.currentTarget.checked) {
                if (allowedPieceTypes == "edges") {
                  setAllowedPieceTypes("any");
                }
              } else {
                if (allowedPieceTypes == "any") {
                  setAllowedPieceTypes("edges");
                  if (pieceType != "edge") nextPiece("edges");
                }
              }
            }}
            type="checkbox"
            checked={
              allowedPieceTypes == "any" || allowedPieceTypes == "corners"
            }
          ></input>
        </div>
        <div className="flex gap-2">
          <label>edges</label>
          <input
            onChange={(e) => {
              if (e.currentTarget.checked) {
                if (allowedPieceTypes == "corners") {
                  setAllowedPieceTypes("any");
                }
              } else {
                if (allowedPieceTypes == "any") {
                  setAllowedPieceTypes("corners");
                  if (pieceType != "corner") nextPiece("corners");
                }
              }
            }}
            type="checkbox"
            checked={allowedPieceTypes == "any" || allowedPieceTypes == "edges"}
          ></input>
        </div>
      </div>
      <h2 className="text-white">Streak: {streak}</h2>
      {state == "submitting" && (
        <p className="text-white">Guess the letters!</p>
      )}
      {state == "correct" && <p className="text-[#2FB44B]">Correct :)</p>}
      {state == "incorrect" && <p className="text-[#CB2127]">Incorrect :(</p>}
      <div className="flex flex-col gap-5 items-center">
        <div className="h-40 w-40">
          <Piece
            onSubmit={(success: boolean) => {
              if (state == "submitting") {
                handleSubmit(success);
              } else if (state == "correct") {
                nextPiece();
                pieceRef.current?.clear();
                setState("submitting");
              } else {
                pieceRef.current?.clear();
                setState("submitting");
                setRedo(true);
              }
            }}
            ref={pieceRef}
            type={pieceType}
            seed={seed}
          />
        </div>
      </div>
      {state == "submitting" && (
        <div className="flex flex-col gap-2">
          <div
            onClick={() => {
              if (pieceRef.current?.canSubmit())
                handleSubmit(pieceRef.current?.submit());
            }}
            className="bg-white px-5 py-2 hover:cursor-pointer font-semibold text-center"
          >
            Submit
          </div>
          <div
            onClick={() => {
              if (pieceRef.current) {
                handleSubmit(pieceRef.current.submit());
              }
            }}
            className="bg-[#CB2127] px-5 py-2 hover:cursor-pointer font-semibold text-center"
          >
            Reveal
          </div>
        </div>
      )}
      {state == "correct" && (
        <div
          onClick={() => {
            nextPiece();
            pieceRef.current?.clear();
            setState("submitting");
          }}
          className="bg-white px-5 py-2 hover:cursor-pointer font-semibold text-center"
        >
          Next
        </div>
      )}
      {state == "incorrect" && (
        <div className="flex flex-col gap-2">
          <div
            onClick={() => {
              pieceRef.current?.clear();
              pieceRef.current?.focus();
              setState("submitting");
              setRedo(true);
            }}
            className="border-white border-[1px] text-white px-5 py-2 hover:cursor-pointer font-semibold text-center"
          >
            Try again
          </div>
          <div
            onClick={() => {
              nextPiece();
              pieceRef.current?.clear();
              setState("submitting");
            }}
            className="bg-white px-5 py-2 hover:cursor-pointer font-semibold text-center"
          >
            Next
          </div>
        </div>
      )}
    </main>
  );
}
