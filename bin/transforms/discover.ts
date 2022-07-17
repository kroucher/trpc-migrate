import { glob } from "glob";
import { Project, Node, CallExpression, ts, Statement, TypeFormatFlags } from "ts-morph";
import chalk from "chalk";
import { v9Router } from "../types/trpcRouters";

const discover = () => {
  console.log(chalk.green("Discovering tRPC routers..."));
  const projectFiles = glob.sync("**/*.ts", {
    cwd: process.cwd(),
    ignore: ["**/node_modules/**", "**/*.d.ts"],
    nodir: true,
    absolute: true,
  });
  console.log(chalk.green(`Found ${projectFiles.length} .ts files`));

  const v9Routers = new Map<string, v9Router>();
  const project = new Project();
  project.addSourceFilesAtPaths(projectFiles);
  project.getSourceFiles().forEach((sourceFile) => {
    sourceFile.getStatements().forEach((statement) => {
      const descendants = statement.getDescendantsOfKind(ts.SyntaxKind.PropertyAccessExpression);
      descendants.forEach((descendant) => {
        const identifier = descendant.getFirstChildByKind(ts.SyntaxKind.Identifier);
        const variableDec = descendant
          .getFirstAncestorByKind(ts.SyntaxKind.VariableDeclaration)
          ?.getFirstChildByKind(ts.SyntaxKind.Identifier);

        if (
          identifier?.getFullText() === "query" ||
          identifier?.getFullText() === "mutation" ||
          identifier?.getFullText() === "subscription" ||
          identifier?.getFullText() === "middleware" ||
          identifier?.getFullText() === "transformer"
        ) {
          descendant?.getNextSiblings().forEach((sibling) => {
            if (sibling.getKind() === ts.SyntaxKind.SyntaxList) {
              sibling.getChildren().forEach((child) => {
                if (child.getKind() === ts.SyntaxKind.StringLiteral) {
                  console.log(chalk.blue(`${identifier.getFullText()} name: ${child.getText()}\n`));
                  if (variableDec && child && identifier.getFullText() === "query") {
                    const existingRouter = v9Routers.get(variableDec.getFullText());
                    if (existingRouter) {
                      existingRouter.methods.push({
                        index: existingRouter.methods.length,
                        type: [{ name: child.getText(), type: "query" }],
                      });
                    } else {
                      v9Routers.set(variableDec.getFullText(), {
                        routerName: variableDec.getFullText(),
                        methods: [
                          {
                            index: 0,
                            type: [
                              {
                                name: child.getText(),
                                type: "query",
                                input: "",
                                output: "",
                              },
                            ],
                          },
                        ],
                      });
                    }
                  } else if (variableDec && child && identifier.getFullText() === "mutation") {
                    const existingRouter = v9Routers.get(variableDec.getFullText());
                    if (existingRouter) {
                      existingRouter.methods.push({
                        index: existingRouter.methods.length,
                        type: [
                          {
                            name: child.getText(),
                            type: "mutation",
                            input: "",
                            output: "",
                          },
                        ],
                      });
                    } else {
                      v9Routers.set(variableDec.getFullText(), {
                        routerName: variableDec.getFullText(),
                        methods: [
                          {
                            index: 0,
                            type: [
                              {
                                name: child.getText(),
                                type: "mutation",
                                input: "",
                                output: "",
                              },
                            ],
                          },
                        ],
                      });
                    }
                  }
                }
              });
            }
          });
        }
      });
    });
  });
  console.log(chalk.blue("\nRouters:"));
  v9Routers.forEach((router) => {
    console.log(chalk.blue(`\nRouter Name:${router.routerName}`));
    const queries = router.methods.filter((method) => method.type[0].type === "query");
    const mutations = router.methods.filter((method) => method.type[0].type === "mutation");
    if (queries.length > 0) {
      console.log(chalk.blue(`    Queries:`));
      queries.forEach((query) => {
        console.log(chalk.blue(`      ${query.type[0].name}`));
      });
    }

    if (mutations.length > 0) {
      console.log(chalk.blue(`    Mutations:`));
      mutations.forEach((mutation) => {
        console.log(chalk.blue(`      ${mutation.type[0].name}`));
      });
    }
  });

  console.log(chalk.green("Done discovering tRPC routers"));
};
export default discover;
