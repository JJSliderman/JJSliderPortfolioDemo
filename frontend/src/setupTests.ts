import { server } from "./setupServer";
import { test } from "@playwright/test";

test.beforeAll(() => server.listen());
test.afterEach(() => server.resetHandlers());
test.afterAll(() => server.close());
