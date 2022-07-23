package axwt.util

import axwt.core.AXWTObjectMapper
import com.fasterxml.jackson.databind.type.TypeFactory

/**
 * A String that contains JSON
 */
typealias JsonString = String

fun Any.toJsonString(): JsonString = AXWTObjectMapper.writeValueAsString(this)

inline fun <reified T> JsonString.parseJson(): T = AXWTObjectMapper.readValue(this, T::class.java)

inline fun <reified T> JsonString.parseJsonArray(): List<T> {
    val typeReference = TypeFactory.defaultInstance().constructCollectionType(List::class.java, T::class.java)
    return AXWTObjectMapper.readValue<List<T>>(this, typeReference)
}