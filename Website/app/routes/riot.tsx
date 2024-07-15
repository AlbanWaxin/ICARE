import { Outlet} from "@remix-run/react";
import {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  redirect,
  json,
} from "@remix-run/node";
import { getUserId } from "~/utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (!userId) {
      return redirect("/login");
  }
  return json({}, { status: 200 });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username");
  const tag = formData.get("tag");
  if (username == undefined || tag == undefined) {
      return redirect("/riot");
  }
  let url = "http://localhost:6000/riot/add_follow";
  let body = {
      user: username,
      tag: tag,
  };
  await fetch(url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
  });
  return redirect("/riot");
}


export default function Index() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
