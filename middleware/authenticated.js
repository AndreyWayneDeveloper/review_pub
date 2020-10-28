export default function ({ app, store, redirect }) {
  if (!app.$cookies.get('token')) {
    return redirect('/auth')
  }
}
