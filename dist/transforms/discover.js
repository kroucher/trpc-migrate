"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = require("glob");
const ts_morph_1 = require("ts-morph");
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
    const v9Routers = new Map();
    const project = new ts_morph_1.Project();
    project.addSourceFilesAtPaths(projectFiles);
    project.getSourceFiles().forEach((sourceFile) => {
        sourceFile.getStatements().forEach((statement) => {
            const descendants = statement.getDescendantsOfKind(ts_morph_1.ts.SyntaxKind.PropertyAccessExpression);
            descendants.forEach((descendant) => {
                var _a;
                const identifier = descendant.getFirstChildByKind(ts_morph_1.ts.SyntaxKind.Identifier);
                const variableDec = (_a = descendant
                    .getFirstAncestorByKind(ts_morph_1.ts.SyntaxKind.VariableDeclaration)) === null || _a === void 0 ? void 0 : _a.getFirstChildByKind(ts_morph_1.ts.SyntaxKind.Identifier);
                if ((identifier === null || identifier === void 0 ? void 0 : identifier.getFullText()) === "query" ||
                    (identifier === null || identifier === void 0 ? void 0 : identifier.getFullText()) === "mutation" ||
                    (identifier === null || identifier === void 0 ? void 0 : identifier.getFullText()) === "subscription" ||
                    (identifier === null || identifier === void 0 ? void 0 : identifier.getFullText()) === "middleware" ||
                    (identifier === null || identifier === void 0 ? void 0 : identifier.getFullText()) === "transformer") {
                    descendant === null || descendant === void 0 ? void 0 : descendant.getNextSiblings().forEach((sibling) => {
                        if (sibling.getKind() === ts_morph_1.ts.SyntaxKind.SyntaxList) {
                            sibling.getChildren().forEach((child) => {
                                var _a, _b;
                                console.log(identifier === null || identifier === void 0 ? void 0 : identifier.getFullText());
                                if (child.getKind() === ts_morph_1.ts.SyntaxKind.StringLiteral) {
                                    //console.log(chalk.blue(`${identifier.getFullText()} name: ${child.getText()}\n`));
                                    if (variableDec && child && identifier.getFullText() === "query") {
                                        const existingRouter = v9Routers.get(variableDec.getFullText());
                                        if (existingRouter) {
                                            (_a = existingRouter.methods) === null || _a === void 0 ? void 0 : _a.push({
                                                index: existingRouter.methods.length,
                                                type: [{ name: child.getText(), type: "query" }],
                                            });
                                        }
                                        else {
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
                                    }
                                    else if (variableDec && child && identifier.getFullText() === "mutation") {
                                        const existingRouter = v9Routers.get(variableDec.getFullText());
                                        if (existingRouter) {
                                            (_b = existingRouter.methods) === null || _b === void 0 ? void 0 : _b.push({
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
                                        }
                                        else {
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
                                else if (child.getKind() === ts_morph_1.ts.SyntaxKind.Identifier) {
                                    if (variableDec && child && identifier.getFullText() === "transformer") {
                                        console.log("in transformer");
                                        console.log(child.getText());
                                        const existingRouter = v9Routers.get(variableDec.getFullText());
                                        if (existingRouter) {
                                            existingRouter.transformer = {
                                                name: child.getText(),
                                                type: "transformer",
                                            };
                                        }
                                        else {
                                            v9Routers.set(variableDec.getFullText(), {
                                                routerName: variableDec.getFullText(),
                                                transformer: {
                                                    name: child.getText(),
                                                    type: "transformer",
                                                },
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
    console.log(chalk_1.default.blue("\nRouters:"));
    v9Routers.forEach((router) => {
        var _a, _b;
        console.log(chalk_1.default.blue(`\nRouter Name:${router.routerName}`));
        const queries = (_a = router.methods) === null || _a === void 0 ? void 0 : _a.filter((method) => method.type[0].type === "query");
        const mutations = (_b = router.methods) === null || _b === void 0 ? void 0 : _b.filter((method) => method.type[0].type === "mutation");
        const transformer = router.transformer;
        if (transformer) {
            console.log(chalk_1.default.blue(`    Transformer:`));
            console.log(chalk_1.default.blue(`      ${transformer.name}`));
        }
        if (queries && queries.length > 0) {
            console.log(chalk_1.default.blue(`    Queries:`));
            queries.forEach((query) => {
                console.log(chalk_1.default.blue(`      ${query.type[0].name}`));
            });
        }
        if (mutations && mutations.length > 0) {
            console.log(chalk_1.default.blue(`    Mutations:`));
            mutations.forEach((mutation) => {
                console.log(chalk_1.default.blue(`      ${mutation.type[0].name}`));
            });
        }
    });
    console.log(chalk_1.default.green("Done discovering tRPC routers"));
};
exports.default = discover;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzY292ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9iaW4vdHJhbnNmb3Jtcy9kaXNjb3Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLCtCQUE0QjtBQUM1Qix1Q0FBeUY7QUFDekYsa0RBQTBCO0FBRzFCLE1BQU0sUUFBUSxHQUFHLEdBQUcsRUFBRTtJQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO0lBQ3hELE1BQU0sWUFBWSxHQUFHLFdBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ3hDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFO1FBQ2xCLE1BQU0sRUFBRSxDQUFDLG9CQUFvQixFQUFFLFdBQVcsQ0FBQztRQUMzQyxLQUFLLEVBQUUsSUFBSTtRQUNYLFFBQVEsRUFBRSxJQUFJO0tBQ2YsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsWUFBWSxDQUFDLE1BQU0sWUFBWSxDQUFDLENBQUMsQ0FBQztJQUVuRSxNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztJQUM5QyxNQUFNLE9BQU8sR0FBRyxJQUFJLGtCQUFPLEVBQUUsQ0FBQztJQUM5QixPQUFPLENBQUMscUJBQXFCLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFO1FBQzlDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUMvQyxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsb0JBQW9CLENBQUMsYUFBRSxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQzNGLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVB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