import { RemoteAddCategory } from '../../../data/usecase/remote-add-categories'
import { AddCategory } from '../../../domain/usecase'
import { makeApiUrl, makeAxiosHttpClient } from '../http'

export const makeRemoteAddCategory = (): AddCategory => 
  new RemoteAddCategory(
    makeApiUrl('expense-category'),
    makeAxiosHttpClient()
  )
