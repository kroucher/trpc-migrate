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
                                if (child.getKind() === ts_morph_1.ts.SyntaxKind.StringLiteral) {
                                    console.log(chalk_1.default.blue(`${identifier.getFullText()} name: ${child.getText()}\n`));
                                    if (variableDec && child && identifier.getFullText() === "query") {
                                        const existingRouter = v9Routers.get(variableDec.getFullText());
                                        if (existingRouter) {
                                            console.log("router exists");
                                            existingRouter.methods.push({
                                                index: existingRouter.methods.length,
                                                type: [{ name: child.getText(), type: "query" }],
                                            });
                                        }
                                        else {
                                            console.log("router does not exist");
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
                                            console.log("router exists");
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
                                        }
                                        else {
                                            console.log("router does not exist");
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
    // console.log a table of all routers and their methods
    console.log(chalk_1.default.blue("\nRouters:"));
    v9Routers.forEach((router) => {
        console.log(chalk_1.default.blue(`\nRouter Name:${router.routerName}`));
        const queries = router.methods.filter((method) => method.type[0].type === "query");
        const mutations = router.methods.filter((method) => method.type[0].type === "mutation");
        if (queries.length > 0) {
            console.log(chalk_1.default.blue(`    Queries:`));
            queries.forEach((query) => {
                console.log(chalk_1.default.blue(`      ${query.type[0].name}`));
            });
        }
        if (mutations.length > 0) {
            console.log(chalk_1.default.blue(`    Mutations:`));
            mutations.forEach((mutation) => {
                console.log(chalk_1.default.blue(`      ${mutation.type[0].name}`));
            });
        }
    });
    console.log(chalk_1.default.green("Done discovering tRPC routers"));
};
exports.default = discover;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzY292ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9iaW4vdHJhbnNmb3Jtcy9kaXNjb3Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLCtCQUE0QjtBQUM1Qix1Q0FBeUY7QUFFekYsa0RBQTBCO0FBTTFCLE1BQU0sUUFBUSxHQUFHLEdBQUcsRUFBRTtJQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO0lBQ3hELE1BQU0sWUFBWSxHQUFHLFdBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ3hDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFO1FBQ2xCLE1BQU0sRUFBRSxDQUFDLG9CQUFvQixFQUFFLFdBQVcsQ0FBQztRQUMzQyxLQUFLLEVBQUUsSUFBSTtRQUNYLFFBQVEsRUFBRSxJQUFJO0tBQ2YsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsWUFBWSxDQUFDLE1BQU0sWUFBWSxDQUFDLENBQUMsQ0FBQztJQUVuRSxNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztJQUM5QyxNQUFNLE9BQU8sR0FBRyxJQUFJLGtCQUFPLEVBQUUsQ0FBQztJQUM5QixPQUFPLENBQUMscUJBQXFCLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFO1FBQzlDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUMvQyxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsb0JBQW9CLENBQUMsYUFBRSxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQzNGLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVB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