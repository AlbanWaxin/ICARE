import {
    LoaderFunctionArgs,
    LinksFunction,
    redirect,
    json,
} from "@remix-run/node";
// import { json } from "@remix-run/node";
import fetch from "node-fetch";
import { useLoaderData, Form, useSubmit } from "@remix-run/react";

import { useEffect, useState } from "react";
import stylesMAS from "~/styles/mas.css?url";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: stylesMAS }];
};

type Webtoon = {
    url: string;
    state:
        | "not_up_to_date"
        | "up_to_date"
        | "up_innactive"
        | "finished"
        | "dropped"
        | "innactive";
    last_chapter_read: number;
    name: string;
    chapter_list: Chapter[];
    image: string;
};

type Chapter = {
    chapter: string;
    date: string;
};

const MAS = () => {
    const webtoons = useLoaderData<typeof loader>();
    let innactive = [];
    let not_up_to_date = [];
    let up_to_date = [];
    let up_innactive = [];
    let finished = [];
    let dropped = [];
    for (let i = 0; i < webtoons.length; i++) {
        if (webtoons[i].state == "not_up_to_date") {
            not_up_to_date.push(<Webtoon_Card key={i} webtoon={webtoons[i]} />);
        } else if (webtoons[i].state == "up_to_date") {
            up_to_date.push(<Webtoon_Card key={i} webtoon={webtoons[i]} />);
        } else if (webtoons[i].state == "up_innactive") {
            up_innactive.push(<Webtoon_Card key={i} webtoon={webtoons[i]} />);
        } else if (webtoons[i].state == "finished") {
            finished.push(<Webtoon_Card key={i} webtoon={webtoons[i]} />);
        } else if (webtoons[i].state == "dropped") {
            dropped.push(<Webtoon_Card key={i} webtoon={webtoons[i]} />);
        } else if (webtoons[i].state == "innactive") {
            innactive.push(<Webtoon_Card key={i} webtoon={webtoons[i]} />);
        }
    }
    return (
        <div className="basis-full">
            <Adder />
            <Section title="Not up to date" cards={not_up_to_date} />
            <Section title="Up inactive" cards={up_innactive} />
            <Section title="Up to date" cards={up_to_date} />
            <Section title="Inactive" cards={innactive} />
            <Section title="Finished" cards={finished} />
            <Section title="Dropped" cards={dropped} />
        </div>
    );
};

type AddProps = {};

const Adder = (props: AddProps) => {
    const [input_value, setInputValue] = useState("");
    return (
        <div className="add w-full sticky bg-[#222222]">
            <div className="w-full h-1/2 flex flex-row justify-center">
                <input
                    className="w-2/5 h-1/2 text-white bg-[#222222] border-2 border-white rounded-md p-1 text-center font-bold m-0 pr-2"
                    type="text"
                    placeholder="Webtoon page url"
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                    className="rounded-md p-1 text-white text-xs w-1/12 text-center font-bold m-0  ml-6 mr-2 border-2 border-white bg-[#5b65ec]"
                    onClick={(e) => new_webtoon(input_value, e)}
                >
                    Add
                </button>
                <Form
                    id="hidden-add-form"
                    style={{ display: "none" }}
                    method="post"
                    action="/mas"
                >
                    <input type="hidden" name="webtoon" value={input_value} />
                    <input type="hidden" name="user" value="CodeCubes" />
                    <input type="hidden" name="form_action" value="add" />
                </Form>
            </div>
        </div>
    );
};

type SectionProps = {
    title: string;
    cards: JSX.Element[];
};

const Section = (props: SectionProps) => {
    return (
        <div className="basis-full flex-col">
            <h1 className="h-fit text-4xl text-center text-white font-sans mt-4 mb-4">
                {props.title}
            </h1>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 ml-4 mr-4">
                {props.cards}
            </div>
        </div>
    );
};

type CardProps = {
    webtoon: Webtoon;
    key: number;
};

const Webtoon_Card = (props: CardProps) => {
    return (
        <div className="w-full mx-auto min-h-40 max-h-48 rounded-xl bg-[#333333]">
            <div className="flex flex-row h-4/5 min-h-40">
                <Card_Image
                    image={props.webtoon.image}
                    title={props.webtoon.name}
                />
                <Card_Content
                    url={props.webtoon.url}
                    name={props.webtoon.name}
                    chapter={props.webtoon.last_chapter_read}
                    list={props.webtoon.chapter_list}
                    state={props.webtoon.state}
                />
            </div>
            <div className="flex flex-row h-1/5">
                <Left_Button
                    url={props.webtoon.url}
                    state={props.webtoon.state}
                />
                <Right_Button
                    url={props.webtoon.url}
                    state={props.webtoon.state}
                />
            </div>
        </div>
    );
};

const Card_Content = (props: any) => {
    return (
        <div className="w-2/3 h-full flex flex-col">
            <a className="" href={props.url}>
                <h5 className="text-white font-bold whitespace-nowrap text-ellipsis overflow-hidden mt-2 mr-2 p-0">
                    {props.name}
                </h5>
            </a>
            <div className="w-full flex flex-row mt-2">
                <p className="w-1/2 text-white">
                    Last: {props.chapter}/{props.list[0].chapter.split(" ")[1]}
                </p>
                <Pill state={props.state} url={props.url} />
            </div>
            <div className="MAS_card_list_but">
                <Chapter_list_Up_button
                    list={props.list}
                    current={props.chapter}
                    url={props.url}
                />
            </div>
        </div>
    );
};

type CardImageProps = {
    image: string;
    title: string;
};

const Card_Image = (props: CardImageProps) => {
    return (
        <div className="w-1/3 pr-4 h-full">
            <img
                className="w-full h-full object-fill rounded-tl-xl"
                src={props.image}
                alt={props.title}
            />
        </div>
    );
};

type PillProps = {
    state:
        | "not_up_to_date"
        | "up_to_date"
        | "up_innactive"
        | "finished"
        | "dropped"
        | "innactive";
    url: string;
};

const Pill = (props: PillProps) => {
    const [hover, setHover] = useState(false);
    const hovering = () => {
        setHover(!hover);
    };
    let state: string = props.state;
    if (props.state === "innactive") {
        state = "inactive";
    }
    let color = hover ? "finished" : props.state;

    return (
        <div className="w-1/2">
            <button
                className={
                    color +
                    " rounded-md p-1  text-white text-xs w-4/6 text-center font-bold m-0 ml-6 mr-2 pt-1 "
                }
                onClick={(e) => finish(props.url, e)}
                onMouseEnter={hovering}
                onMouseLeave={hovering}
            >
                {hover ? "Finished?" : state.split("_").join(" ")}
            </button>
            <Form
                id={"hidden-finish-form-" + props.url}
                style={{ display: "none", width: "0px", height: "0px" }}
                method="post"
                action="/mas"
            >
                <input type="hidden" name="webtoon" value={props.url} />
                <input type="hidden" name="user" value="CodeCubes" />
                <input type="hidden" name="form_action" value="finish" />
            </Form>
        </div>
    );
};

type Chapter_list_Up_buttonProps = {
    list: Chapter[];
    current: string;
    url: string;
};

const Chapter_list_Up_button = (props: Chapter_list_Up_buttonProps) => {
    const [selectedvalue, setSelected] = useState(props.current);
    return (
        <div className="w-full flew flex-row">
            <select
                className="w-1/2 h-1/2 text-white bg-[#222222] border-2 border-white rounded-md p-1 text-center font-bold m-0 pr-2 mt-6"
                defaultValue={"Chapter " + String(selectedvalue)}
                onChange={(e) => {
                    setSelected(e.target.value);
                }}
            >
                {props.list.map((chapter, index) => {
                    return (
                        <option key={index} value={chapter.chapter}>
                            {chapter.chapter}
                        </option>
                    );
                })}
            </select>

            <button
                className="rounded-md p-1 text-white text-xs w-2/6 text-center font-bold m-0  ml-6 mr-2 mt-6 mb-6  pt-1 border-2 bg-[#5b65ec]"
                onClick={(e) => {
                    update(selectedvalue, props.url, e);
                }}
            >
                Up?
            </button>
            <Form
                id={"hidden-update-form-" + props.url}
                style={{ display: "none" }}
                method="post"
                action="/mas"
            >
                <input type="hidden" name="webtoon" value={props.url} />
                <input type="hidden" name="chapter" value={selectedvalue} />
                <input type="hidden" name="user" value="CodeCubes" />
                <input type="hidden" name="form_action" value="update" />
            </Form>
        </div>
    );
};

type ButtonProps = {
    url: string;
    state:
        | "not_up_to_date"
        | "up_to_date"
        | "up_innactive"
        | "finished"
        | "dropped"
        | "innactive";
};

const Left_Button = (props: ButtonProps) => {
    return (
        <div className="w-1/2 flex flex-1 items-start text-center">
            <a
                href={props.url}
                target="_blank"
                className="w-full text-white text-s  rounded-bl-xl h-4/5 bg-[#5b65ec] "
            >
                {" "}
                Read{" "}
            </a>
        </div>
    );
};

const Right_Button = (props: ButtonProps) => {
    let color =
        props.state === "finished"
            ? "finished"
            : props.state === "dropped"
              ? "dropped"
              : "dropped";
    return (
        <div className="w-1/2 flex flex-1 items-start text-center">
            <button
                className={
                    color + " rounded-br-xl w-full text-white text-s h-4/5"
                }
                onClick={(e) => unfinish_drop_resume(props.url, e, props.state)}
            >
                {props.state == "dropped"
                    ? "Resume"
                    : props.state == "finished"
                      ? "Unfinish"
                      : "Drop"}
            </button>
            <Form
                id={"hidden-drop-form-" + props.url}
                style={{ display: "none" }}
                method="post"
                action="/mas"
            >
                <input type="hidden" name="webtoon" value={props.url} />
                <input type="hidden" name="user" value="CodeCubes" />
                <input type="hidden" name="form_action" value="drop" />
            </Form>
            <Form
                id={"hidden-resume-form-" + props.url}
                style={{ display: "none" }}
                method="post"
                action="/mas"
            >
                <input type="hidden" name="webtoon" value={props.url} />
                <input type="hidden" name="user" value="CodeCubes" />
                <input type="hidden" name="form_action" value="resume" />
            </Form>
            <Form
                id={"hidden-unfinish-form-" + props.url}
                style={{ display: "none" }}
                method="post"
                action="/mas"
            >
                <input type="hidden" name="webtoon" value={props.url} />
                <input type="hidden" name="user" value="CodeCubes" />
                <input type="hidden" name="form_action" value="unfinish" />
            </Form>
        </div>
    );
};

export default MAS;

export const loader = async (args: LoaderFunctionArgs) => {
    const response = await fetch("http://127.0.0.1:6000/mas?user=CodeCubes");
    const data: any = await response.json();
    let webtoons: Webtoon[] = [];
    for (var i = 0; i < data.length; i++) {
        webtoons.push({
            url: data[i].url,
            state: data[i].state,
            last_chapter_read: data[i].last_chapter_read,
            name: data[i].name,
            chapter_list: data[i].chapter_list,
            image: data[i].image,
        });
    }
    return webtoons;
};



function update(chapter: string, url: string, e: any) {
    console.log(e);
    e.preventDefault();
    let elt:any = document.getElementById("hidden-update-form-" + url);
    if (elt === null){
        return
    }
    elt.submit();
}

function finish(url: string, e: any) {
    console.log(e);
    e.preventDefault();
    let elt:any = document.getElementById("hidden-finish-form-" + url);
    if (elt === null){
        return
    }
    elt.submit();
}

function unfinish_drop_resume(url: string, e: any, state: string) {
    console.log(e);
    e.preventDefault();
    let elt:any = undefined;
    if (state === "finished") {
        elt = document.getElementById("hidden-unfinish-form-" + url);
        if (elt === null){
            return
        }
    } else if (state === "dropped") {
        elt = document.getElementById("hidden-resume-form-" + url);
        if (elt === null){
            return
        }
    } else {
        elt = document.getElementById("hidden-drop-form-" + url);
        if (elt === null){
            return
        }
    }
    elt.submit();
}

function new_webtoon(url: string, e: any) {
    console.log(e);
    e.preventDefault();
    let elt:any = document.getElementById("hidden-add-form-");
        if (elt === null){
            return
        }
    elt.submit();
}
