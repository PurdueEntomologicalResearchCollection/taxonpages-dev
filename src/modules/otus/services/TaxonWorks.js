import { makeAPIRequest } from '@/utils/request'

/**
 * Generate query params for pagination.
 * @param opt.per {number} - Number of items per page.
 * @param opt.page {number} - Page number
 * @returns {""|string}
 */
const perPage = (opt) => {
  const { per, page } = opt ?? {}
  const queryParams = [per && `per=${per}`, page && `page=${page}`].filter(Boolean).join("&")
  return queryParams && `?${queryParams}` // prepend "?" if there are any query params
}

export default class TaxonWorks {
  static getTaxonNameCitations(taxonId, opt) {
    return makeAPIRequest.get(`/taxon_names/${taxonId}/inventory/catalog`, opt)
  }

  static getOtu(id) {
    return makeAPIRequest.get(`/otus/${id}`, {
      params: { extend: ['parents'] }
    })
  }

  static getOtus(params) {
    return makeAPIRequest.get(`/otus.json`, {
      params
    })
  }

  static getTaxon(id, opt) {
    return makeAPIRequest.get(`/taxon_names/${id}`, opt)
  }

  static summary(id, opt) {
    return makeAPIRequest.get(`/taxon_names/${id}/inventory/summary`, opt)
  }

  static getTaxonTypeDesignation(id) {
    return makeAPIRequest.get(`/taxon_names/${id}`, {
      params: { extend: ['type_taxon_name_relationship'] }
    })
  }

  static getObservations(params) {
    return makeAPIRequest.get('/observations', { params })
  }

  static getOtuImages(otuId, opt) {
    return makeAPIRequest.get(`/otus/${otuId}/inventory/images.json`, opt)
  }

  static getTaxonomy(otuId, opt) {
    return makeAPIRequest.get(`/otus/${otuId}/inventory/taxonomy.json`, opt)
  }

  static getOtuTypeMaterial(otuId) {
    return makeAPIRequest.get(`/otus/${otuId}/inventory/type_material.json`)
  }

  static getOtuDistribution(otuId, opt = {}) {
    return makeAPIRequest.get(`/otus/${otuId}/inventory/distribution.json`, opt)
  }

  static getOtuGeoJSONDistribution(otuId) {
    return makeAPIRequest.get(`/otus/${otuId}/inventory/distribution.geojson`)
  }

  static getCachedMap(cachedId, opt) {
    return makeAPIRequest.get(`/cached_maps/${cachedId}`, opt)
  }

  static getOtuContent(otuId, opt) {
    return makeAPIRequest.get(`/otus/${otuId}/inventory/content`, opt)
  }

  /** The descendant taxa of an OTU, in Darwin Core format. */
  static getDescendantsDarwinCore(otuId, opt) {
    return makeAPIRequest.get(`/otus/${otuId}/inventory/dwc.json${perPage(opt)}`, opt)
  }

  static getDescendantsImageGallery(otuId, opt) {
    return makeAPIRequest.get(`/otus/${otuId}/inventory/dwc_gallery.json${perPage(opt)}`, opt)
  }

  static getCollectionObjectsNotes(collectionObjectIds, opt) {
    const processedOpt = {
      ...opt,
        params: {
            ...opt?.params,
            note_object_type: "CollectionObject",
            "note_object_id[]": collectionObjectIds,
        }
    }
    return makeAPIRequest.get(`/notes/`, processedOpt)
  }

  static getCollectionObjectsTags(collectionObjectIds, opt) {
    const processedOpt = {
      ...opt,
        params: {
            ...opt?.params,
            note_object_type: "CollectionObject",
            "tag_object_id[]": collectionObjectIds,
        }
    }
    return makeAPIRequest.get(`/tags/`, processedOpt)
  }

  // Counts of specimens within a given taxon that are identified only to a certain rank, and no finer.
  // For example, {class: null, order: null, family: 3, genus: 5, species; 25, subspecies: 2}
  // would mean that 3 specimens (probably lots of multiple individuals) have only been identified
  // down to the family level, so they are good candidates to borrow for further identification.
  static getDeterminedToRank(otuId, opt) {
    return makeAPIRequest.get(`/otus/${otuId}/inventory/determined_to_rank.json`, opt)
  }

  /** Load image info (thumbnail, etc) from a URL such as one in a Darwin Core 'associatedMedia' field. */
  static getImageFromUrl(url, opt) {
    // sanity check that this is the kind of URL we're looking for
    // if it isn't, the data is likely to not work downstream
    if (!url.indexOf('/api/v1') < 0)
      throw new Error('Unsupported URL. Must be a TaxonWorks v1 API URL (containing "/api/v1").')
    const path = url.split('/api/v1')[1] // remove the base URL -- just keep the part after /api/v1
    return makeAPIRequest.get(path, opt)
  }

  static getCachedMap(id) {
    return makeAPIRequest.get(`/cached_maps/${id}`)
  }

  static getKeys(otuId) {
    return makeAPIRequest.get(`/otus/${otuId}/inventory/keys`)
  }

  static getSounds(params) {
    return makeAPIRequest.get('/sounds', { params })
  }

  // Get all tags available in the system
  static getAllTags(opt) {
    return makeAPIRequest.get('/tags', opt)
  }

  // Get all keywords (controlled vocabulary terms)
  static getKeywords(opt) {
    const processedOpt = {
      ...opt,
      params: {
        ...opt?.params,
        type: 'Keyword'
      }
    }
    return makeAPIRequest.get('/controlled_vocabulary_terms', processedOpt)
  }

  // Get tags for specific keyword (tag name)
  static getTagsByKeyword(keyword, opt) {
    const processedOpt = {
      ...opt,
      params: {
        ...opt?.params,
        keyword_id: keyword
      }
    }
    return makeAPIRequest.get('/tags', processedOpt)
  }

  // Get specimens (collection objects) filtered by keywords
  static getCollectionObjectsByTags(keywordIds, opt) {
    const processedOpt = {
      ...opt,
      params: {
        ...opt?.params,
        'keyword_id[]': keywordIds
      }
    }
    return makeAPIRequest.get('/collection_objects', processedOpt)
  }

  // Note: Darwin Core endpoint doesn't support keyword filtering
  // Use getDescendantsDarwinCore + getCollectionObjectsTags + client-side filtering instead
}
