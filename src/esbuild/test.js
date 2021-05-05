const result = require('esbuild').transformSync(`
@Component({})
class Aa extends Vue {
  
}
`, {
  loader: 'ts',
});

console.log(result);
