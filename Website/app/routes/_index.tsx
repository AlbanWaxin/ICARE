import type { LinksFunction } from "@remix-run/node";
import stylesUrl from "~/styles/index.css?url";
import {redirect,LoaderFunctionArgs,json} from "@remix-run/node";
import { getUserId } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (!userId) {
      return redirect("/login");
  }
  return json({}, { status: 200 })
}

const Index = () => {
  return (
    <div className="box-layout">
      <SectionBox image="/MAS.png" title="MAS" link="/mas" />
      <SectionBox image="/riot.png" title="RST" link="/riot" />
      <SectionBox image="/paimon_bg.png" title="GTB" link="/genshin" />
      <SectionBox image="/pompom.webp" title="HTB" link="/honkaisr" />
    </div>
  );
};

export default Index;

type sectionBox_props = {
  image: string;
  title: string;
  link: string;
};

function SectionBox({ image, title, link }: sectionBox_props) {
  return (
      <a href={link} className="section-box">
        <div className="section-image">
          <img src={image} alt={title} />
        </div>
        <div className="section-title">{title}</div>
      </a>
  );
}
