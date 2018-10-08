import { mount } from "@vue/test-utils";
import ListPlaylists from "@/components/ListPlaylists.vue";

describe("ListPlaylists.vue", () => {
  it("has an empty playlists array", () => {
    const wrapper = mount(ListPlaylists);
    const vm = wrapper.vm;

    expect(wrapper.vm.playlists).toEqual([]);
  });
});
