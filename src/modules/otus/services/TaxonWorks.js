import { makeAPIRequest } from '@/utils/request'

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

  // Note that this could support multiple OTUs.
  // The API takes a comma-separated list of OTU IDs.
  static getCollectionObjects(otuId, opt) {
    return makeAPIRequest.get(`/collection_objects?otu_id[]=${otuId}`, opt)
    // See taxonworks/lib/collection_object/filter.rb Queries:CollectionObject:Filter for full list of options.
    // However, none seems to change the result.
    /*
        @with_buffered_collecting_event = boolean_param(params, :with_buffered_collecting_event)
        @with_buffered_determinations = boolean_param(params, :with_buffered_determinations)
        @with_buffered_other_labels = boolean_param(params, :with_buffered_other_labels)
     */
    // return makeAPIRequest.get(`/collection_objects?otu_id[]=${otuId}&with_buffered_determination=true`, opt)
    // return makeAPIRequest.get(`/collection_objects?otu_id[]=${otuId}&descendants=true`, opt)
    // return makeAPIRequest.get(`/collection_objects?otu_id[]=${otuId}/dwc.json`, opt)
  }

  static getOtuInventoryDarwinCore(otuId, opt) {
    return makeAPIRequest.get(`/otus/${otuId}/inventory/dwc.json`, opt)
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
}
