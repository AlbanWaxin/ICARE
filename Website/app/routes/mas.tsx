import { Outlet } from "@remix-run/react";
import { getUserId } from "~/utils/session.server";

import {
    LoaderFunctionArgs,
    ActionFunctionArgs,
    redirect,
    json,
} from "@remix-run/node";

export let action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const webtoon:any = formData.get("webtoon");
    const user = formData.get("user");
    const chapter:any = formData.get("chapter");
    const form_action = formData.get("form_action");
    if (webtoon == undefined || user == undefined || form_action == undefined) {
        return redirect("/mas");
    }
    let url = "http://localhost:6000/mas/";
    let body = {};
    switch (form_action) {
        case "add":
            url += "add";
            body = {
                url_list: webtoon.split(";"),
                user: user,
            };
            break;
        case "finish":
            url += "set_finished";
            body = {
                webtoon: webtoon,
                user: user,
            };
            break;
        case "update":
            url += "update_chapter";
            body = {
                webtoon: webtoon,
                chapter: +chapter.split(" ")[1],
                user: user,
            };
            break;
        case "drop":
            url += "set_dropped";
            body = {
                webtoon: webtoon,
                user: user,
            };
            break;
        case "resume":
            url += "set_undrop";
            body = {
                webtoon: webtoon,
                user: user,
            };
            break;
        case "unfinish":
            url += "set_unfinished";
            body = {
                webtoon: webtoon,
                user: user,
            };
            break;
        default:
            return redirect("/mas");
    }
    fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
    });
    return redirect("/mas");
};

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect("/login");
    }
    return json({}, { status: 200 });
}

export default function Index() {
    return (
        <div>
            <Outlet />
        </div>
    );
}
