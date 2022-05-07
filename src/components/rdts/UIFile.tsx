import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useDispatch, useSelector } from "react-redux";
import { getRepoStore } from "../../store/slices/RepoSlice";
import { Breadcrumb, Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Redirect } from "../../utils/Navigation";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import { useParams } from "react-router-dom";
import { repoId2RepoInfo } from "../../utils/Association";
import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import Loading from "../../layout/components/Loading";

const UIFileNotFound = () => {
  const dispatcher = useDispatch();
  // Get project ID
  const params = useParams<"id">();
  const project_id = Number(params.id);

  const pathname = window.location.pathname
    .split("/")
    .filter((str: string) => str !== "");

  const projectStore = useSelector(getProjectStore);

  return (
    <div className={"personal-setting-container"}>
      <div style={{ fontSize: "2rem" }}>项目文件树</div>
      <hr style={{ width: "98%", margin: "1rem auto" }} />
      <Breadcrumb
        style={{
          width: "98%",
          margin: "1rem auto",
          textAlign: "left",
        }}
      >
        <Breadcrumb.Item>
          <a
            onClick={() => {
              Redirect(dispatcher, `/project/${pathname[1]}/tree/`, 0);
            }}
          >
            <FontAwesomeIcon icon={faHome} />
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Typography.Link
            onClick={() => {
              Redirect(dispatcher, `/project/${pathname[1]}/tree/`, 0);
            }}
          >
            {JSON.parse(projectStore).data.project.title}
          </Typography.Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ fontSize: "1.5rem" }}>
        <span style={{ fontWeight: "bold" }}>
          抱歉，您所查看的项目文件不存在！
        </span>
      </div>
    </div>
  );
};

const UIFile = () => {
  const dispatcher = useDispatch();
  const repoStore = useSelector(getRepoStore);
  const projectStore = useSelector(getProjectStore);

  const params = useParams<"id">();
  const project_id = Number(params.id);

  const codeString = `using namespace std\nint main(){\n  return 0;\n}`;

  const [loaded, setLoaded] = React.useState(false);
  const [savedBranches, setSavedBranches] = React.useState("{}");
  const [savedFiles, setSavedFiles] = React.useState("{}");

  const link = window.location.href;

  // From `http://localhost:3000/project/2/tree/123` get ['tree', '123']
  // Wanted data format: ['tree', repo_id, branch_name, file_path]
  const pathname = window.location.pathname
    .split("/")
    .filter((str: string) => str !== "")
    .slice(2);
  console.debug(pathname);

  let isFile = false;
  const files: any[] = [];
  const breadcrumb_list: any[] = [];

  // Pre-defined functions
  const isRepoIDValid = (repo_id: number) => {
    return (
      JSON.parse(repoStore).data.filter((obj: any) => obj.id === repo_id)
        .length > 0
    );
  };

  const isBranchValid = (repo_id: number, branch_name: string) => {
    console.debug(repo_id, branch_name);
  };

  // Parse pathname
  if (pathname.length === 1) {
    // Prepare for breadcrumb
    breadcrumb_list.push({
      name: JSON.parse(projectStore).data.project.title,
      link: `/project/${project_id}/tree/`,
    });

    // Prepare for showing directory
    JSON.parse(repoStore).data.forEach((repo: any) => {
      files.push({
        name: repo.title,
        type: "directory",
        link: ["tree", repo.id],
      });
    });
  } else if (pathname.length === 2) {
    // Test if repo_id is valid
    if (!isRepoIDValid(Number(pathname[1]))) {
      // Error: Repo not found
      return (
        <div>
          <UIFileNotFound />
        </div>
      );
    }

    // Prepare for breadcrumb
    breadcrumb_list.push({
      name: JSON.parse(projectStore).data.project.title,
      link: `/project/${project_id}/tree/`,
    });
    breadcrumb_list.push({
      name: repoId2RepoInfo(Number(pathname[1]), repoStore).title, // Get repo name
      link: `/project/${project_id}/tree/${pathname[1]}`,
    });

    // If savedBranches is empty, wait for branches to be loaded
    if (JSON.parse(savedBranches)[Number(pathname[1])] === undefined) {
      // Get Branchs
      const branches = request_json(API.GET_PROJECT_REPO_BRANCH, {
        getParams: {
          project: project_id,
          repo: Number(pathname[1]),
        },
      }).then((res: any) => {
        if (res.data.http_status === 200) {
          const curr_branch = JSON.parse(savedBranches);
          curr_branch[Number(pathname[1])] = res.data.body.map(
            (branch: any) => branch.name
          );
          setSavedBranches(JSON.stringify(curr_branch));
        }
      });

      // TODO: Return Loading
      return (
        <div className={"personal-setting-container"}>
          <Loading />
        </div>
      );
    } else {
      // Prepare for directory
      files.push({ name: "..", type: "directory", link: ["tree"] });
      JSON.parse(savedBranches)[Number(pathname[1])].forEach((branch: any) => {
        files.push({
          name: branch,
          type: "directory",
          link: ["tree", pathname[1], branch],
        });
      });
    }
  } else if (pathname.length >= 3) {
    // TODO: Tree, repo_id, branch_name, file_path
    if (pathname.length === 3) {
      pathname.push("/");
    }
    // Join pathname and get file_path
    const file_path = pathname.join("/");

    if (JSON.parse(savedFiles)[file_path] === undefined) {
      // Query for file list
      request_json(API.GET_FORWARD_TREE, {
        getParams: {
          project: project_id,
          repo: Number(pathname[1]),
          ref: pathname[2],
          path: pathname.slice(3).join("/"),
        },
      }).then((res: any) => {
        if (res.data.http_status === 200) {
          const curr_files = JSON.parse(savedFiles);
          curr_files[file_path] = res.data.body;
          setSavedFiles(JSON.stringify(curr_files));
        }
      });

      // TODO: Return Loading
      return (
        <div className={"personal-setting-container"}>
          <Loading />
        </div>
      );
    } else {
      // Prepare for breadcrumb
      breadcrumb_list.push({
        name: JSON.parse(projectStore).data.project.title,
        link: `/project/${project_id}/tree/`,
      });
      breadcrumb_list.push({
        name: repoId2RepoInfo(Number(pathname[1]), repoStore).title, // Get repo name
        link: `/project/${project_id}/tree/${pathname[1]}`,
      });
      for (let i = 2; i < pathname.length; i++) {
        breadcrumb_list.push({
          name: pathname[i],
          link:
            "/project/" + project_id + "/" + pathname.slice(0, i + 1).join("/"),
        });
      }

      // Prepare for showing directory
      files.push({
        name: "..",
        type: "directory",
        link: pathname.slice(0, pathname.length - 1),
      });
      JSON.parse(savedFiles)[file_path].forEach((file: any) => {
        files.push({
          name: file.name,
          type: file.type === "tree" ? "directory" : "file",
          link: ["tree", pathname[1], pathname[2], file.path],
        });
      });
    }
  }

  isFile = true;
  console.debug(files);

  return (
    <div className={"personal-setting-container"}>
      <div
        style={{
          fontSize: "2rem",
          marginLeft: "1rem",
          userSelect: "none",
          alignSelf: "flex-start",
        }}
      >
        项目文件树
      </div>
      <hr style={{ width: "98%", margin: "1rem auto" }} />
      <Breadcrumb
        style={{
          width: "98%",
          margin: "1rem auto",
          textAlign: "left",
        }}
      >
        <Breadcrumb.Item>
          <a
            onClick={() => {
              Redirect(dispatcher, `/project/${pathname[1]}/tree/`, 0);
            }}
          >
            <FontAwesomeIcon icon={faHome} />
          </a>
        </Breadcrumb.Item>
        {breadcrumb_list.map((item: { link: string; name: string }, index) => {
          return (
            <Breadcrumb.Item key={index.toString() + item.name}>
              <Typography.Link
                onClick={() => {
                  Redirect(dispatcher, item.link, 0);
                }}
              >
                {item.name}
              </Typography.Link>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
      <p>{savedBranches}</p>
      <p>{savedFiles}</p>
      <p>{JSON.stringify(files)}</p>
      <div style={{ width: "90%" }}>
        <SyntaxHighlighter
          language="cpp"
          style={a11yDark}
          showLineNumbers={true}
          wrapLongLines={true}
          lineProps={(lineNumber) => {
            const appended_list = document.getElementsByClassName("Appended");
            for (let i = appended_list.length - 1; i >= 0; --i) {
              appended_list[i].remove();
            }

            const unique_ID =
              Math.random().toString(8) + "-" + lineNumber.toString();

            setTimeout(() => {
              console.debug(unique_ID);
              const Node = document.createElement("span");
              Node.style.setProperty("flex-grow", "1");
              Node.className = `Appended`;

              const Node1 = document.createElement("span");
              Node1.innerText = "1233";
              Node1.className = "Appended";
              Node1.style.setProperty("background-color", "grey");
              Node1.style.setProperty("border-radius", "0.15rem");
              Node1.style.setProperty("padding", "0.05rem 0.15rem");
              Node1.style.setProperty("margin", "0rem 0.15rem");

              const Node2 = document.createElement("span");
              Node2.innerText = "1234";
              Node2.className = "Appended";
              Node2.style.setProperty("background-color", "grey");
              Node2.style.setProperty("border-radius", "0.15rem");
              Node2.style.setProperty("padding", "0.05rem 0.15rem");
              Node2.style.setProperty("margin", "0rem 0.15rem");

              const Node3 = document.createElement("span");
              Node3.innerText = "1235";
              Node3.className = "Appended";
              Node3.style.setProperty("background-color", "grey");
              Node3.style.setProperty("border-radius", "0.15rem");
              Node3.style.setProperty("padding", "0.05rem 0.15rem");
              Node3.style.setProperty("margin", "0rem 0.15rem");

              document.getElementById(unique_ID)?.appendChild(Node);
              document.getElementById(unique_ID)?.appendChild(Node1);
              document.getElementById(unique_ID)?.appendChild(Node2);
              document.getElementById(unique_ID)?.appendChild(Node3);
            }, 400);

            return {
              onClick: () => {
                console.debug(lineNumber);
              },
              style: {
                margin: "0.15rem",
              },
              id: unique_ID,
            };
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default UIFile;
