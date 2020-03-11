import {
  RequestType as RT,
  RequestStatus as RS,
} from "@modules/common/requests";
import { slice, initialState } from "./slice";

const { reducer, actions } = slice;

describe("todo slice", () => {
  describe("reducer, actions, selectors", () => {
    it("should return the initial state on first run", () => {
      // Arrange
      const nextState = initialState;

      // Act
      const result = reducer(undefined, { type: "" });

      // Assert
      expect(result).toEqual(nextState);
    });

    describe("loading", () => {
      it(actions.load.type, () => {
        // Arrange
        const nextState = initialState;

        // Act
        const result = reducer(undefined, { type: "" });

        // Assert
        expect(result).toEqual(nextState);
        // loading.data
        expect(result.loading.data.length).toEqual(0);
        // loading.request
        expect(result.loading.request.payload).toBeUndefined();
        expect(result.loading.request.type).toEqual(RT.read);
        expect(result.loading.request.status).toEqual(RS.inProgress);
      });

      it(actions.loadDone.type, () => {
        // Arrange
        const payload = [
          {
            id: 0.30673463111541177,
            completed: true,
            text: "Todo 3.",
          },
          {
            id: 0.22126505210584257,
            completed: true,
            text: "Todo 4.",
          },
          {
            id: 0.5823614201227101,
            completed: false,
            text: "Todo 8.",
          },
        ];

        // Act
        const result = reducer(initialState, actions.loadDone(payload));

        // Assert
        const { loading, entities } = result;
        expect(loading.request.type).toEqual(RT.read);
        expect(loading.request.status).toEqual(RS.success);
        expect(loading.data.length).toEqual(payload.length);
        // entities payload
        expect(Object.values(entities).length).toEqual(payload.length);

        payload.forEach(item => {
          expect(loading.data.indexOf(item.id)).not.toEqual(-1);
          expect(entities[item.id]).not.toBeUndefined();

          const { data, request } = entities[item.id];
          expect(data.id).toEqual(item.id);
          expect(data.text).toEqual(item.text);
          expect(data.completed).toEqual(item.completed);
          // request
          expect(request.type).toEqual(RT.read);
          expect(request.status).toEqual(RS.success);
        });
      });

      it(actions.loadError.type, () => {
        // Arrange

        const errorMessage = "Error message";

        // Act
        const result = reducer(
          initialState,
          actions.loadError({ message: errorMessage })
        );

        // Assert
        expect(result.loading.request.type).toEqual(RT.read);
        expect(result.loading.request.status).toEqual(RS.error);
        expect(result.loading.request.error).toEqual(errorMessage);
      });

      it(actions.loadCancel.type, () => {
        // Arrange

        // Act
        const result = reducer(initialState, actions.loadCancel());

        // Assert
        expect(result.loading.request.type).toEqual(RT.read);
        expect(result.loading.request.status).toEqual(RS.success);
      });
    });
  });
});
