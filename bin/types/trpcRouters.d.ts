export interface v9Router {
  routerName: string;
  methods: Method[];
}

export interface v9Query {
  name: string;
  type: string;
  input?: string;
  output?: string;
}

export interface v9Mutation {
  name: string;
  type: string;
  input?: string;
  output?: string;
}

interface Method {
  index?: number;
  type: [v9Query | v9Mutation];
  input?: string;
  output?: string;
}
