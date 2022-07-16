"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = require("glob");
const ts_morph_1 = require("ts-morph");
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const discover = () => {
    console.log(chalk_1.default.green("Discovering tRPC routers..."));
    const projectFiles = glob_1.glob.sync("**/*.ts", {
        cwd: process.cwd(),
        ignore: ["**/node_modules/**", "**/*.d.ts"],
        nodir: true,
        absolute: true,
    });
    console.log(chalk_1.default.green(`Found ${projectFiles.length} .ts files`));
    const old_tRPC_Routers = [];
    const project = new ts_morph_1.Project();
    project.addSourceFilesAtPaths(projectFiles);
    project.getSourceFiles().forEach((sourceFile) => {
        sourceFile.getStatements().forEach((statement) => {
            const descendants = statement.getDescendantsOfKind(ts_morph_1.ts.SyntaxKind.CallExpression);
            descendants.forEach((descendant) => {
                var _a, _b, _c, _d, _e;
                if (descendant.getKind() === ts_morph_1.ts.SyntaxKind.CallExpression) {
                    const type = (_b = (_a = descendant.getReturnType().getSymbol()) === null || _a === void 0 ? void 0 : _a.getDeclaredType()) === null || _b === void 0 ? void 0 : _b.getText();
                    if (type === null || type === void 0 ? void 0 : type.match(/.Router<TInputContext, TContext, TMeta, TQueries, TMutations, TSubscriptions, TErrorShape>/)) {
                        // descendant is a router
                        const expressionName = (_d = (_c = descendant
                            .getFirstAncestorByKind(ts_morph_1.ts.SyntaxKind.VariableStatement)) === null || _c === void 0 ? void 0 : _c.getDeclarations()[0]) === null || _d === void 0 ? void 0 : _d.getName();
                        const expressionType = (_e = descendant.getFirstAncestorByKind(ts_morph_1.ts.SyntaxKind.VariableDeclaration)) === null || _e === void 0 ? void 0 : _e.getType();
                        if (expressionName && expressionType) {
                            //console.log(chalk.green(`Name: ${expressionName}`));
                            //console.log(chalk.green(`Type: ${expressionType.getSymbol()?.getName()}`));
                            const args = descendant.getArguments();
                            if (descendant
                                .getExpression()
                                .getText()
                                .split(".")
                                .find((x) => x === "query")) {
                                // descendant is a query
                                if (args) {
                                    args.forEach((arg, i) => {
                                        if (arg.getKind() === ts_morph_1.ts.SyntaxKind.StringLiteral) {
                                            //console.log(chalk.green(`Query Name: ${arg.getText()}`));
                                        }
                                        if (arg.getKind() === ts_morph_1.ts.SyntaxKind.ObjectLiteralExpression) {
                                            const properties = arg.getChildrenOfKind(ts_morph_1.ts.SyntaxKind.PropertyAssignment);
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
                            if (descendant
                                .getExpression()
                                .getText()
                                .split(".")
                                .find((x) => x === "mutation")) {
                                // descendant is a mutation
                                if (args) {
                                    args.forEach((arg, i) => {
                                        if (arg.getKind() === ts_morph_1.ts.SyntaxKind.StringLiteral) {
                                            //console.log(chalk.green(`Mutation Name: ${arg.getText()}`));
                                        }
                                        if (arg.getKind() === ts_morph_1.ts.SyntaxKind.ObjectLiteralExpression) {
                                            const properties = arg.getChildrenOfKind(ts_morph_1.ts.SyntaxKind.PropertyAssignment);
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
                            if (descendant
                                .getExpression()
                                .getText()
                                .split(".")
                                .find((x) => x === "subscription")) {
                                // descendant is a subscription
                                console.log(chalk_1.default.green(`Found subscription ${descendant.getText()}`));
                            }
                            if (descendant
                                .getExpression()
                                .getText()
                                .split(".")
                                .find((x) => x === "middleware")) {
                                // descendant is an error
                                console.log(chalk_1.default.green(`Found middleware ${descendant.getText()}`));
                            }
                        }
                    }
                }
            });
        });
    });
    console.log(chalk_1.default.green(`Found ${old_tRPC_Routers.length} tRPC routers`));
    console.log(chalk_1.default.green(`Writing tRPC routers to file...`));
    const tRPC_Routers_json = JSON.stringify(old_tRPC_Routers, null, 2);
    fs_1.default.writeFileSync("./tRPC_Routers.json", tRPC_Routers_json);
    console.log(chalk_1.default.green(`Done!`));
    const newRouters = new Set(old_tRPC_Routers);
    console.log(newRouters);
};
exports.default = discover;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzY292ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9iaW4vdHJhbnNmb3Jtcy9kaXNjb3Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLCtCQUE0QjtBQUM1Qix1Q0FBeUY7QUFDekYsNENBQW9CO0FBQ3BCLGtEQUEwQjtBQUsxQixNQUFNLFFBQVEsR0FBRyxHQUFHLEVBQUU7SUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQztJQUN4RCxNQUFNLFlBQVksR0FBRyxXQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUN4QyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRTtRQUNsQixNQUFNLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxXQUFXLENBQUM7UUFDM0MsS0FBSyxFQUFFLElBQUk7UUFDWCxRQUFRLEVBQUUsSUFBSTtLQUNmLENBQUMsQ0FBQztJQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLFlBQVksQ0FBQyxNQUFNLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDbkUsTUFBTSxnQkFBZ0IsR0FBc0IsRUFBRSxDQUFDO0lBQy9DLE1BQU0sT0FBTyxHQUFHLElBQUksa0JBQU8sRUFBRSxDQUFDO0lBQzlCLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM1QyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7UUFDOUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQy9DLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxhQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ2pGLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFV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