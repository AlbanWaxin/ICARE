import { Form } from "@remix-run/react";
import { createUserSession, hashData, getUserId } from "~/utils/session.server";
import { ActionFunctionArgs, redirect, json,LoaderFunctionArgs } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = hashData(formData.get("password"));
    const response = await fetch("http://127.0.0.1:6000/login", {
        method: "POST",
        body: JSON.stringify({ username: username, password: password }),
    });
    if (response.status !== 200) {
        return redirect("/login");
    }
    return createUserSession({
        request,
        userId: password,
    });
}

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);
    if (userId) {
        return redirect("/");
    }
    return json({}, { status: 200 });
}

export default function LoginPage() {
    return (
        <Form
            method="post"
            className="flex flex-col w-80 mx-auto mt-5 p-4 bg-gray-800 border border-gray-700 rounded shadow-md space-y-4"
        >
            <div>
                <label
                    htmlFor="username"
                    className="block mb-2 font-semibold text-white"
                >
                    Username
                </label>
                <input
                    id="username"
                    required
                    name="username"
                    type="text"
                    autoComplete="email"
                    className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block mb-2 font-semibold text-white"
                >
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Log in
            </button>
        </Form>
    );
}
