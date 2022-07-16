import { glob } from "glob";
import { Project, Node, CallExpression, ts, Statement, TypeFormatFlags } from "ts-morph";
import fs from "fs";
import chalk from "chalk";
import { type } from "os";
import { Console } from "console";
import { old_tRPC_Router } from "../types/trpcRoutes";

const discover = () => {
  console.log(chalk.green("Discovering tRPC routers..."));
  const projectFiles = glob.sync("**/*.ts", {
    cwd: process.cwd(),
    ignore: ["**/node_modules/**", "**/*.d.ts"],
    nodir: true,
    absolute: true,
  });
  console.log(chalk.green(`Found ${projectFiles.length} .ts files`));
  const old_tRPC_Routers: old_tRPC_Router[] = [];
  const project = new Project();
  project.addSourceFilesAtPaths(projectFiles);
  project.getSourceFiles().forEach((sourceFile) => {
    sourceFile.getStatements().forEach((statement) => {
      const descendants = statement.getDescendantsOfKind(ts.SyntaxKind.CallExpression);
      descendants.forEach((descendant) => {
        if (descendant.getKind() === ts.SyntaxKind.CallExpression) {
          const type = descendant.getReturnType().getSymbol()?.getDeclaredType()?.getText();
          if (
            type?.match(/.Router<TInputContext, TContext, TMeta, TQueries, TMutations, TSubscriptions, TErrorShape>/)
          ) {
            // descendant is a router
            const expressionName = descendant
              .getFirstAncestorByKind(ts.SyntaxKind.VariableStatement)
              ?.getDeclarations()[0]
              ?.getName();
            const expressionType = descendant.getFirstAncestorByKind(ts.SyntaxKind.VariableDeclaration)?.getType();
            if (expressionName && expressionType) {
              //console.log(chalk.green(`Name: ${expressionName}`));
              //console.log(chalk.green(`Type: ${expressionType.getSymbol()?.getName()}`));

              const args = descendant.getArguments();
              if (
                descendant
                  .getExpression()
                  .getText()
                  .split(".")
                  .find((x) => x === "query")
              ) {
                // descendant is a query
                if (args) {
                  args.forEach((arg, i) => {
                    if (arg.getKind() === ts.SyntaxKind.StringLiteral) {
                      //console.log(chalk.green(`Query Name: ${arg.getText()}`));
                    }
                    if (arg.getKind() === ts.SyntaxKind.ObjectLiteralExpression) {
                      const properties = arg.getChildrenOfKind(ts.SyntaxKind.PropertyAssignment);
                      properties.forEach((property) => {
                        const name = property.getName();
                        const value = property.getText();
                        //console.log(chalk.green(`Query Prop #${i}: ${name} = ${value}`));
                        old_tRPC_Routers.push({
                          routerName: expressionName,
                          type: "query",
                          query: arg.getText(),
                          input: value,
                        });
                      });
                    }
                  });
                }
              }
              if (
                descendant
                  .getExpression()
                  .getText()
                  .split(".")
                  .find((x) => x === "mutation")
              ) {
                // descendant is a mutation
                if (args) {
                  args.forEach((arg, i) => {
                    if (arg.getKind() === ts.SyntaxKind.StringLiteral) {
                      //console.log(chalk.green(`Mutation Name: ${arg.getText()}`));
                    }
                    if (arg.getKind() === ts.SyntaxKind.ObjectLiteralExpression) {
                      const properties = arg.getChildrenOfKind(ts.SyntaxKind.PropertyAssignment);
                      properties.forEach((property) => {
                        const name = property.getName();
                        const value = property.getText();
                        //console.log(chalk.green(`Mutation Prop #${i}: ${name} = ${value}`));
                        old_tRPC_Routers.push({
                          routerName: expressionName,
                          type: "mutation",
                          query: arg.getText(),
                          input: value,
                        });
                      });
                    }
                  });
                }
              }
              if (
                descendant
                  .getExpression()
                  .getText()
                  .split(".")
                  .find((x) => x === "subscription")
              ) {
                // descendant is a subscription
                console.log(chalk.green(`Found subscription ${descendant.getText()}`));
              }
              if (
                descendant
                  .getExpression()
                  .getText()
                  .split(".")
                  .find((x) => x === "middleware")
              ) {
                // descendant is an error
                console.log(chalk.green(`Found middleware ${descendant.getText()}`));
              }
            }
          }
        }
      });
    });
  });
  console.log(chalk.green(`Found ${old_tRPC_Routers.length} tRPC routers`));
  console.log(chalk.green(`Writing tRPC routers to file...`));
  const tRPC_Routers_json = JSON.stringify(old_tRPC_Routers, null, 2);
  fs.writeFileSync("./tRPC_Routers.json", tRPC_Routers_json);
  console.log(chalk.green(`Done!`));

  const newRouters = new Set(old_tRPC_Routers);
  console.log(newRouters);
};
export default discover;
