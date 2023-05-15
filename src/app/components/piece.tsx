import React, {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const Piece = forwardRef(
  (
    props: {
      type: string;
      seed: number;
      onSubmit: (success: boolean) => void;
    },
    ref
  ) => {
    const [oneValue, setOneValue] = useState<string>("");
    const [twoValue, setTwoValue] = useState<string>("");
    const [threeValue, setThreeValue] = useState<string>("");

    const formRef = useRef<HTMLFormElement>(null);
    const inputOneRef = useRef<HTMLInputElement>(null);

    const getColours = () => {
      switch (props.seed) {
        case 0: {
          return props.type == "corner"
            ? ["#F68A4A", "#336BB4", "#FFFFFF"]
            : ["#376BB4", "#FFFFFF"];
        }
        case 1: {
          return props.type == "corner"
            ? ["#336BB4", "#CE2129", "#FFFFFF"]
            : ["#F68B4A", "#FFFFFF"];
        }
        case 2: {
          return props.type == "corner"
            ? ["#F68A4A", "#FFFFFF", "#34B44B"]
            : ["#FFFFFF", "#CB2127"];
        }
        case 3: {
          return props.type == "corner"
            ? ["#FFFFFF", "#CE2129", "#34B44B"]
            : ["#FFFFFF", "#2FB44B"];
        }
        case 4: {
          return props.type == "corner"
            ? ["#F68A4A", "#34B44B", "#F3EC1F"]
            : ["#F68A4A", "#376BB4"];
        }
        case 5: {
          return props.type == "corner"
            ? ["#34B44B", "#CE2129", "#F3EC1F"]
            : ["#376BB4", "#CB2127"];
        }
        case 6: {
          return props.type == "corner"
            ? ["#F68A4A", "#F3EC1F", "#336BB4"]
            : ["#F68B4A", "#2FB44B"];
        }
        case 7: {
          return props.type == "corner"
            ? ["#F3EC1F", "#CE2129", "#336BB4"]
            : ["#2FB44B", "#CB2127"];
        }
        case 8: {
          return ["#2FB44B", "#F8ED1E"];
        }
        case 9: {
          return ["#F68B4A", "#F8ED1E"];
        }
        case 10: {
          return ["#F8ED1E", "#CB2127"];
        }
        case 11: {
          return ["#376BB4", "#F8ED1E"];
        }
        default: {
          return [];
        }
      }
    };

    const getSolution = () => {
      switch (props.seed) {
        case 0: {
          return props.type == "corner" ? ["E", "R", "A"] : ["Q", "A", ""];
        }
        case 1: {
          return props.type == "corner" ? ["Q", "N", "B"] : ["E", "D", ""];
        }
        case 2: {
          return props.type == "corner" ? ["F", "D", "I"] : ["B", "M", ""];
        }
        case 3: {
          return props.type == "corner" ? ["C", "M", "J"] : ["C", "I", ""];
        }
        case 4: {
          return props.type == "corner" ? ["G", "L", "U"] : ["H", "R", ""];
        }
        case 5: {
          return props.type == "corner" ? ["K", "P", "V"] : ["T", "N", ""];
        }
        case 6: {
          return props.type == "corner" ? ["H", "X", "S"] : ["F", "L", ""];
        }
        case 7: {
          return props.type == "corner" ? ["W", "O", "T"] : ["J", "P", ""];
        }
        case 8: {
          return ["K", "U", ""];
        }
        case 9: {
          return ["G", "X", ""];
        }
        case 10: {
          return ["V", "O", ""];
        }
        case 11: {
          return ["S", "W", ""];
        }
        default: {
          return [];
        }
      }
    };

    useImperativeHandle(ref, () => ({
      submit() {
        return submit();
      },
      focus() {
        setTimeout(() => formRef.current.one.focus(), 100);
      },
      canSubmit() {
        if (props.type == "corner" && oneValue && twoValue && threeValue) {
          return true;
        } else if (props.type == "edge" && oneValue && twoValue) {
          return true;
        }
        formRef.current?.requestSubmit();
        return false;
      },
      clear() {
        setOneValue("");
        setTwoValue("");
        setThreeValue("");
      },
    }));

    const submit = () => {
      setTimeout(() => formRef.current.one.focus(), 100);
      const solution = getSolution();

      const success =
        JSON.stringify([
          oneValue.toUpperCase(),
          twoValue.toUpperCase(),
          threeValue.toUpperCase(),
        ]) == JSON.stringify(solution);

      setOneValue(solution[0]);
      setTwoValue(solution[1]);
      setThreeValue(solution[2]);

      return success;
    };

    const isVertical = (seed: number) => {
      if ([0, 3, 8, 11].includes(seed)) {
        return true;
      }
      return false;
    };

    useEffect(() => {
      setTimeout(() => formRef.current.one.focus(), 100);
    }, []);

    return (
      <div className="h-full w-full">
        {props.type == "corner" && (
          <div className="relative h-full w-full">
            <div className="absolute inset-0 h-full w-full">
              <svg
                height="100%"
                width="100%"
                viewBox="0 0 58 58"
                preserveAspectRatio="none"
                style={{ transform: "rotateZ(180deg)" }}
              >
                <g>
                  <polygon
                    fill={getColours()[0]}
                    points="29,58 55,45 55,13 29,26"
                  />
                  <polygon
                    fill={getColours()[1]}
                    points="29,58 3,45 3,13 29,26"
                  />
                  <polygon
                    fill={getColours()[2]}
                    points="3,13 28,0 55,13 29,26"
                  />
                </g>
              </svg>
            </div>
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                props.onSubmit(submit());
              }}
              className="relative w-full h-full"
            >
              <input
                ref={inputOneRef}
                className="absolute w-[25%] top-[28%] left-[15%] bg-black/50 text-[1.5rem] text-center"
                type="text"
                name="one"
                value={oneValue}
                onChange={(e) => {
                  if (e.target.value.length < 2 && e.target.value != " ")
                    setOneValue(e.target.value);
                }}
                required={true}
              />
              <input
                className="absolute w-[25%] top-[28%] right-[15%] bg-black/50 text-[1.5rem] text-center"
                type="text"
                name="two"
                value={twoValue}
                onChange={(e) => {
                  if (e.target.value.length < 2 && e.target.value != " ")
                    setTwoValue(e.target.value);
                }}
                required={true}
              />
              <input
                className="absolute w-[25%] top-[66%] left-[50%] bg-black/50 translate-x-[-50%] text-[1.5rem] text-center"
                type="text"
                name="three"
                value={threeValue}
                onChange={(e) => {
                  if (e.target.value.length < 2 && e.target.value != " ")
                    setThreeValue(e.target.value);
                }}
                required={true}
              />
              <input className="invisible" type="submit" />
            </form>
          </div>
        )}
        {props.type == "edge" && (
          <div className="h-full w-full">
            {!isVertical(props.seed) && (
              <div className="relative h-full w-full">
                <div className="absolute inset-0 h-full w-full">
                  <svg
                    height="100%"
                    width="100%"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <g>
                      <polygon
                        fill={getColours()[0]}
                        points="50,100 0,100 0,0 50,0"
                      />
                      <polygon
                        fill={getColours()[1]}
                        points="100,100 50,100 50,0 100,0"
                      />
                    </g>
                  </svg>
                </div>
                <form
                  ref={formRef}
                  onSubmit={(e) => {
                    e.preventDefault();
                    props.onSubmit(submit());
                  }}
                  className="relative w-full h-full"
                >
                  <input
                    ref={inputOneRef}
                    className="absolute w-[25%] top-[50%] left-[12%] bg-black/50 text-[1.5rem] text-center translate-y-[-50%]"
                    type="text"
                    name="one"
                    value={oneValue}
                    onChange={(e) => {
                      if (e.target.value.length < 2 && e.target.value != " ")
                        setOneValue(e.target.value);
                    }}
                    required={true}
                  />
                  <input
                    className="absolute w-[25%] top-[50%] right-[12%] bg-black/50 text-[1.5rem] text-center translate-y-[-50%]"
                    type="text"
                    name="two"
                    value={twoValue}
                    onChange={(e) => {
                      if (e.target.value.length < 2 && e.target.value != " ")
                        setTwoValue(e.target.value);
                    }}
                    required={true}
                  />
                  <input className="invisible" type="submit" />
                </form>
              </div>
            )}
            {isVertical(props.seed) && (
              <div className="relative h-full w-full">
                <div className="absolute inset-0 h-full w-full">
                  <svg
                    height="100%"
                    width="100%"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    style={{ transform: "rotateZ(90deg)" }}
                  >
                    <g>
                      <polygon
                        fill={getColours()[0]}
                        points="50,100 0,100 0,0 50,0"
                      />
                      <polygon
                        fill={getColours()[1]}
                        points="100,100 50,100 50,0 100,0"
                      />
                    </g>
                  </svg>
                </div>
                <form
                  ref={formRef}
                  onSubmit={(e) => {
                    e.preventDefault();
                    props.onSubmit(submit());
                  }}
                  className="relative w-full h-full"
                >
                  <input
                    ref={inputOneRef}
                    className="absolute w-[25%] top-[12%] left-[50%] bg-black/50 text-[1.5rem] text-center translate-x-[-50%]"
                    type="text"
                    name="one"
                    value={oneValue}
                    onChange={(e) => {
                      if (e.target.value.length < 2 && e.target.value != " ")
                        setOneValue(e.target.value);
                    }}
                    required={true}
                  />
                  <input
                    className="absolute w-[25%] bottom-[14%] left-[50%] bg-black/50 text-[1.5rem] text-center translate-x-[-50%]"
                    type="text"
                    name="two"
                    value={twoValue}
                    onChange={(e) => {
                      if (e.target.value.length < 2 && e.target.value != " ")
                        setTwoValue(e.target.value);
                    }}
                    required={true}
                  />
                  <input className="invisible" type="submit" />
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default Piece;
